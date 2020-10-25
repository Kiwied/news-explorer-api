const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');

const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { signin, signup } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const limiter = require('./utils/rateLimiter');

const { NODE_ENV, MONGODB, PORT = 3000 } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production'
  ? MONGODB
  : 'mongodb://localhost:27017/newsdb',
{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(helmet());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), signup);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);

app.use(auth);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(centralizedErrorHandler);

app.listen(PORT);
