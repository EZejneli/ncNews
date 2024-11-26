const { fetchTopics } = require('../models/topicsModel');

exports.getTopics = (req, res, next) => {
  try {
    const topics = fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};