
const commentsRouter = require('express').Router();
const { getCommentsByArticleId } = require('../controllers/comments.controller');

commentsRouter.route('/:article_id/comments').get(getCommentsByArticleId);

module.exports = commentsRouter;