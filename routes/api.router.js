const express = require('express');
const apiRouter = express.Router();
const articlesRouter = require('./articles.router');
const topicsRouter = require('./topics.router');
const commentsRouter = require('./comments.router');
const { getEndpoints } = require('../controllers/api.controller');

apiRouter.get('/', getEndpoints);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;