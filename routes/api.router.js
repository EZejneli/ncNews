const express = require('express');
const apiRouter = express.Router();
const articlesRouter = require('./articles.router');
const topicsRouter = require('./topics.router');
const { getEndpoints } = require('../controllers/api.controller');

apiRouter.get('/', getEndpoints);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;