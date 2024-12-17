const { fetchTopics } = require('../models/topics.model');

exports.getTopics = (req, res, next) => {
  console.log('Received request to get topics');
  console.log('Starting to fetch topics from the database');
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};