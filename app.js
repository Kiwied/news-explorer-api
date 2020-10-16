const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const articles = require('./routes/articles');
const auth = require('./middlewares/auth');
const { signin, signup } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());

app.post('/signup', signup);
app.post('/signin', signin);

app.use(auth);

app.use('/users', users);
app.use('/articles', articles);

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