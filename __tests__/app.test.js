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

  test("200: Responds with articles sorted by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        for (let i = 1; i < articles.length; i++) {
          expect(articles[i - 1].title.localeCompare(articles[i].title)).toBeGreaterThanOrEqual(0);
        }
      });
  });

  test("200: Responds with articles sorted in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        for (let i = 1; i < articles.length; i++) {
          expect(new Date(articles[i - 1].created_at).getTime()).toBeLessThanOrEqual(new Date(articles[i].created_at).getTime());
        }
      });
  });

  test("400: Responds with 'Bad Request' for invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });

  test("400: Responds with 'Bad Request' for invalid order query", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });

  test('GET /api/articles - 400: Responds with correct message for invalid sort_by', () => {
    return request(app)
      .get('/api/articles?sort_by=invalidColumn')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort_by query');
      });
  });

  test('GET /api/articles - 400: Responds with correct message for invalid order query', () => {
    return request(app)
      .get('/api/articles?order=invalidOrder')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order query');
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

describe('POST /api/articles/:article_id/comments', () => {
  test('201: Adds a comment to the article and responds with the posted comment', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is a test comment',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty('comment_id');
        expect(comment).toHaveProperty('body', 'This is a test comment');
        expect(comment).toHaveProperty('author', 'butter_bridge');
      });
  });

  test("404: Responds with 'User not found' when the username does not exist", () => {
    const newComment = {
      username: 'non_existent_user',
      body: 'This is a test comment',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      });
  });

  test('400: Responds with an error message when the request body is missing required fields', () => {
    const newComment = {};
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: Missing required fields');
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

describe('DELETE /api/comments/:comment_id', () => {
  test('200: Responds with a message when comment is successfully deleted', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment successfully deleted');
      });
  });

  test('404: Responds with "Comment not found" when comment_id does not exist', () => {
    return request(app)
      .delete('/api/comments/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment not found');
      });
  });

  test('400: Responds with "Bad Request" when comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/not-an-id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
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
