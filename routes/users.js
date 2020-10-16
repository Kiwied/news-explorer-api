const router = require('express').Router();

const { getAuthorizedUser } = require('../controllers/users');

router.get('/me', getAuthorizedUser);

module.exports = router;