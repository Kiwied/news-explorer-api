const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const users = require('./routes/users');
const articles = require('./routes/articles');
const notFound = require('./routes/notFound');
const auth = require('./middlewares/auth');
const { signin, signup } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use(requestLogger);

app.post('/signup', signup);
app.post('/signin', signin);

app.use(auth);

app.use('/users', users);
app.use('/articles', articles);
app.use('*', notFound);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
      error: err,
    });
});

app.listen(PORT);