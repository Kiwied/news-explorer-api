const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const { getUserArticles, createArticle, deleteArticle } = require('../controllers/articles');

const urlValidator = (v) => {
  if (!validator.isURL(v)) throw new CelebrateError('Введите валидный url');
  return v;
};

router.get('/', getUserArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    keyword: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(urlValidator),
    image: Joi.string().required().custom(urlValidator),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
