const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getArticles,
  createArticle,
  delArticleById,
} = require('../controllers/articles.js');

const articleValid = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value)) {
        return helper.message('поле link должно быть корректной ссылкой');
      }
      return value;
    }),
    image: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value)) {
        return helper.message('поле image должно быть корректной ссылкой');
      }
      return value;
    }),
  }),
});

const articleIdValid = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});

router.get('/', getArticles);
router.post('/', articleValid, createArticle);
router.delete('/:articleId', articleIdValid, delArticleById);

module.exports = router;
