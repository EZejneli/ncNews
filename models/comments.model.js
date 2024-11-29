const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return checkArticleExists(article_id)
    .then((articleExists) => {
      if (!articleExists) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id
         FROM comments
         WHERE article_id = $1
         ORDER BY created_at DESC`,
        [article_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};

exports.addCommentToArticleInDB = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return Promise.all([
    checkArticleExists(article_id),
    checkUserExists(username),
  ]).then(([articleExists, userExists]) => {
    if (!articleExists) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    if (!userExists) {
      return Promise.reject({ status: 404, msg: 'User not found' });
    }
    return db
      .query(
        `INSERT INTO comments (article_id, author, body)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [article_id, username, body]
      )
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        if (err.code === '23503') {
          // Foreign key violation (either article_id or username doesn't exist)
          return Promise.reject({ status: 404, msg: 'Not Found' });
        } else {
          throw err;
        }
      });
  });
};

exports.removeCommentById = (comment_id) => {
  return db.query(
    `DELETE FROM comments
     WHERE comment_id = $1
     RETURNING *;`,
    [comment_id]
  )
  .then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'Comment not found' });
    }
  });
};

exports.deleteComment = (comment_id) => {
  return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
    });
};

const checkArticleExists = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((result) => {
      return result.rows.length > 0;
    });
};

const checkUserExists = (username) => {
  return db
    .query('SELECT * FROM users WHERE username = $1', [username])
    .then((result) => {
      return result.rows.length > 0;
    });
};