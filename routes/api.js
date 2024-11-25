const express = require('express');
const apiRouter = express.Router();
const endpoints = require('../endpoints.json'); 

// Handle GET requests to `/api`
apiRouter.get('/', (req, res) => {
  res.status(200).send(endpoints);
});

module.exports = apiRouter;
