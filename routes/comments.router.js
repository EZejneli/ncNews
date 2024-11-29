const commentsRouter = require('express').Router({ mergeParams: true });
const { getCommentsByArticleId, addCommentToArticle, deleteCommentById } = require('../controllers/comments.controller');

commentsRouter.route('/')
  .get(getCommentsByArticleId)
  .post(addCommentToArticle);

commentsRouter.route('/:comment_id')
  .delete(deleteCommentById);

module.exports = commentsRouter;