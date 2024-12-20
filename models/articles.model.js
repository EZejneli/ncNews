const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    return db
        .query(
            `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
             FROM articles
             WHERE article_id = $1`,
            [article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0];
        });
};

exports.fetchArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  const validSortBy = ['created_at', 'votes', 'comment_count', 'title', 'author', 'topic'];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
  }

  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  let queryStr = `
    SELECT articles.*, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  const queryValues = [];

  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return result.rows[0];
    });
};