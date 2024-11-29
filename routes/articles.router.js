const express = require('express');
const {
  getArticleById,
  getArticles,
  updateArticleById,
} = require('../controllers/articles.controller');
const commentsRouter = require('./comments.router');

const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById);

articlesRouter.use('/:article_id/comments', commentsRouter);

module.exports = articlesRouter;