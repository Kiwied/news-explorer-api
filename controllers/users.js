const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { JWT_SECRET = 'dev-key' } = process.env;

function getAuthorizedUser(req, res, next) {
  return User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({ user });
      }
    })
    .catch(next);
}

function signup(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.send({
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'MongoError') {
            throw new ConflictError('Пользователь с таким email уже зарегистрирован');
          } else if (err.name === 'ValidationError') {
            throw new BadRequestError('Введены некорректные данные');
          }
        })
        .catch(next);
    })
    .catch(next);
}

function signin(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(next);
}

module.exports = { getAuthorizedUser, signin, signup };
