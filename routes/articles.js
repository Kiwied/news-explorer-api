const router = require('express').Router();

const { getUserArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getUserArticles);

router.post('/', createArticle);

router.delete('/:articleId', deleteArticle);

module.exports = router;