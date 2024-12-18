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
  const validSortBy = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'];
  const validOrder = ['asc', 'desc'];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  if (!validOrder.includes(order)) {
    order = 'desc';
  }

  const orderByClause = sort_by === 'title' 
    ? `LOWER(articles.${sort_by}) ${order}`
    : `articles.${sort_by} ${order}`;

  let queryStr = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  const queryParams = [];

  if (topic) {
    queryStr += ' WHERE articles.topic = $1';
    queryParams.push(topic);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${orderByClause};
  `;

  return db.query(queryStr, queryParams).then((result) => {
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