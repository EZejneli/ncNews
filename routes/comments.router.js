const commentsRouter = require('express').Router({ mergeParams: true });
const { getCommentsByArticleId, addCommentToArticle } = require('../controllers/comments.controller');

commentsRouter.route('/')
  .get(getCommentsByArticleId)
  .post(addCommentToArticle);

module.exports = commentsRouter;