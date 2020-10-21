const Article = require('../models/article');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

function getUserArticles(req, res, next) {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
}

function createArticle(req, res, next) {
  const owner = req.user._id;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => res.send({ article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  Article.findById(req.params.articleId)
    .then((data) => {
      if (data === null) {
        throw new NotFoundError('Статья не найдена');
      } else if ({ $eq: [req.user._id, data.owner] }) {
        Article.findByIdAndRemove(req.params.articleId)
          .then(() => {
            res.send({ message: 'Статья удалена' });
          })
          .catch(next);
      } else {
        throw new NotFoundError('Статья не найдена');
      }
    })
    .catch(next);
}

module.exports = { getUserArticles, createArticle, deleteArticle };
