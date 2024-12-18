const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.addCommentToArticleInDB = (article_id, username, body) => {
  return db
    .query(
      'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *',
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
};

exports.addCommentToArticle = (article_id, username, body) => {
  return db
    .query(
      'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *',
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query('SELECT 1 FROM articles WHERE article_id = $1', [article_id])
    .then((result) => {
      return result.rowCount > 0;
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id]);
};