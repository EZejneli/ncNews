const express = require('express');
const app = express();
const apiRouter = require('./routes/api'); 

app.use(express.json());


app.use('/api', apiRouter);


app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
