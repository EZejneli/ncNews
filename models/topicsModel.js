const topics = process.env.NODE_ENV === 'test'
  ? require('../db/data/test-data/topics')
  : require('../db/data/development-data/topics');

exports.fetchTopics = () => {
  return topics;
};