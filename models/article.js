const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  keyword: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Введите валидный url',
    }
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Введите валидный url',
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    select: false
  }
}, { versionKey: false })

module.exports = mongoose.model('article', articleSchema);