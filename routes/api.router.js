const express = require('express');
const apiRouter = express.Router();
const articlesRouter = require('./articles.router');
const topicsRouter = require('./topics.router');
const { getEndpoints } = require('../controllers/apiController');
const { getArticleById } = require('../controllers/articles.controller');

apiRouter.get('/', getEndpoints);

apiRouter.use('/topics', topicsRouter);

apiRouter.get('/articles/:article_id', getArticleById);

apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;