const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { getCommentsByArticleId } = require('./controllers/comments');

app.use(express.json());

app.use('/api', apiRouter);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

module.exports = app;
