const { fetchCommentsByArticleId, addCommentToArticleInDB, checkArticleExists, removeCommentById, deleteComment, addCommentToArticle } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchCommentsByArticleId(article_id), checkArticleExists(article_id)])
    .then(([comments, articleExists]) => {
      if (!articleExists) {
        return res.status(404).send({ msg: 'Article not found' });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    res.status(400).send({ msg: 'Bad Request: Missing required fields' });
    return;
  }

  addCommentToArticleInDB(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.code === '23503') {
        res.status(404).send({ msg: 'User not found' });
      } else {
        next(err);
      }
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).send({ msg: 'Comment not found' });
      }
      res.status(200).send({ msg: 'Comment successfully deleted' });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: 'Bad Request: Missing required fields' });
  }

  addCommentToArticle(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.code === '23503') {
        res.status(404).send({ msg: 'User not found' });
      } else {
        next(err);
      }
    });
};