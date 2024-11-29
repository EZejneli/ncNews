const endpointsJson = require("../endpoints.json");
const request = require('supertest');
const app = require('../app');
const topicsJson = require('../db/data/test-data/topics');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual(topicsJson);
      });
  });

  test("200: Each topic object should have 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("404: Responds with an error message when the endpoint does not exist", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
      });
  });

  test("404: Responds with an error message when the article does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: Responds with an error message when the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });

  test("200: Articles are sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        for (let i = 1; i < articles.length; i++) {
          expect(new Date(articles[i - 1].created_at).getTime()).toBeGreaterThanOrEqual(new Date(articles[i].created_at).getTime());
        }
      });
  });

  test("200: Each article object includes a comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });

  test("404: Responds with 'Article not found' when the article does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("200: Responds with an empty array when the article has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Adds a comment to the article and responds with the posted comment", () => {
    const newComment = {
      username: "icellusedkars", // Make sure this user exists in your users table
      body: "This is a test comment."
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("author", "icellusedkars");
        expect(comment).toHaveProperty("body", "This is a test comment.");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("votes", 0);
      });
  });

  test("404: Responds with 'User not found' when the username does not exist", () => {
    const newComment = {
      username: "nonexistent_user",
      body: "This is a test comment."
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });

  test("400: Responds with an error message when the request body is missing required fields", () => {
    const newComment = {
      username: "icellusedkars"
      // Missing 'body' field
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article when votes are incremented", () => {
    const updateVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(updateVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article.votes).toBe(101); // Assuming initial votes were 100
      });
  });

  test("200: Responds with the updated article when votes are decremented", () => {
    const updateVote = { inc_votes: -100 };

    return request(app)
      .patch("/api/articles/1")
      .send(updateVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article.votes).toBe(0); // Assuming initial votes were 100
      });
  });

  test("400: Responds with 'Bad Request' when inc_votes is missing", () => {
    const updateVote = {};

    return request(app)
      .patch("/api/articles/1")
      .send(updateVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: Responds with 'Bad Request' when inc_votes is not a number", () => {
    const updateVote = { inc_votes: "not a number" };

    return request(app)
      .patch("/api/articles/1")
      .send(updateVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: Responds with 'Article not found' when article_id does not exist", () => {
    const updateVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/9999")
      .send(updateVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: Responds with 'Bad Request' when article_id is invalid", () => {
    const updateVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/not-an-id")
      .send(updateVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
