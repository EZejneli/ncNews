const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query('SELECT * FROM comments WHERE article_id = $1', [article_id])
    .then((result) => {
      return result.rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((result) => {
      return result.rows.length > 0;
    });
};