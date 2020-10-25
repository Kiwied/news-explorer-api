const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new UnauthorizedError('Необходима авторизация');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(error);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-key');
  } catch (err) {
    next(error);
  }

  req.user = payload;
  next();
};
