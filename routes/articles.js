const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUserArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getUserArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    keyword: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
