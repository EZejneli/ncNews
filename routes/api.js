const express = require('express');
const apiRouter = express.Router();
const { getEndpoints } = require('../controllers/apiController');
const { getTopics } = require('../controllers/topics.controller');
const { getArticleById } = require('../controllers/articles.controller');

apiRouter.get('/', getEndpoints);

apiRouter.get('/topics', getTopics);

apiRouter.get('/articles/:article_id', getArticleById);

module.exports = apiRouter;
