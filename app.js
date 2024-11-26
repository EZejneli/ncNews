const express = require('express');
const apiRouter = require('./routes/api');

const app = express();

app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
