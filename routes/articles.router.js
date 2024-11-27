const articlesRouter = require('express').Router();
const { getArticleById, getArticles } = require('../controllers/articles.controller');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticleById);

module.exports = articlesRouter;