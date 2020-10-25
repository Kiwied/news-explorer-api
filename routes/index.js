const router = require('express').Router();

const users = require('./users');
const articles = require('./articles');
const notFound = require('./notFound');

router.use('/users', users);
router.use('/articles', articles);
router.use('*', notFound);

module.exports = router;
