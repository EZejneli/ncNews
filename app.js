const express = require('express');
const apiRouter = require('./routes/api.router');

const app = express();

app.use(express.json()); // Add this line to parse JSON bodies

app.use('/api', apiRouter);

app.use('*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

module.exports = app;
