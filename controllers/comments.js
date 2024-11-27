const { fetchCommentsByArticleId, checkArticleExists } = require('../models/comments');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchCommentsByArticleId(article_id), checkArticleExists(article_id)])
    .then(([comments, articleExists]) => {
      if (!articleExists) {
        return res.status(404).send({ msg: 'Not Found' });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};