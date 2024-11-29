const { fetchCommentsByArticleId, addCommentToArticleInDB, checkArticleExists, removeCommentById, deleteComment } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    res.status(400).send({ msg: 'Bad Request' });
    return;
  }

  addCommentToArticleInDB(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(200).send({ msg: 'Comment successfully deleted' });
    })
    .catch(next);
};