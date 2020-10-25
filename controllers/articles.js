const Article = require('../models/article');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

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
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => new NotFoundError('Статья не найдена'))
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав');
      }
      return Article.findByIdAndRemove(req.params.articleId);
    })
    .then(() => res.send({ message: 'Статья удалена' }))
    .catch(next);
}

module.exports = { getUserArticles, createArticle, deleteArticle };
