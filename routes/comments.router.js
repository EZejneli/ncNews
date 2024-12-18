const commentsRouter = require('express').Router({ mergeParams: true });
const { getCommentsByArticleId, addComment, deleteCommentById } = require('../controllers/comments.controller');

commentsRouter.route('/')
  .get(getCommentsByArticleId)
  .post(addComment);

commentsRouter.route('/:comment_id')
  .delete(deleteCommentById);

module.exports = commentsRouter;