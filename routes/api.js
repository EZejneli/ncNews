const express = require('express');
const apiRouter = express.Router();
const { getEndpoints } = require('../controllers/apiController');
const { getTopics } = require('../controllers/topicsController');


apiRouter.get('/', getEndpoints);


apiRouter.get('/topics', getTopics);

module.exports = apiRouter;
