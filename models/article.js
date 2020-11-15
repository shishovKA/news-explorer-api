const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({

  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
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


articleSchema.statics.AddOwnerId = function () {
  return this.find().select('+owner')
    .then((articles) => {
      return articles
    });
};

articleSchema.statics.FindArticleById = function (articleId) {
  return this.findById(articleId).select('+owner')
    .then((article) => {
      console.log('statics.FindArticleById', article)
      return article;
    })
};

module.exports = mongoose.model('article', articleSchema);
