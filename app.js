const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Not Found' });
  } else if (err.code === '22P02' || err.code === '23502') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

module.exports = app;
