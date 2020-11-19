const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({

  keyword: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  source: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: true,
  },

  image: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },

});

const findArticleById = function findArticleById(articleId) {
  return this.findById(articleId)
    .select('+owner')
    .then((article) => article);
};

articleSchema.statics.FindArticleById = findArticleById;

module.exports = mongoose.model('article', articleSchema);
