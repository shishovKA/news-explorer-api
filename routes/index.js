const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const routesUsers = require('./users');
const routesArticles = require('./articles.js');
const { requestLogger, errorLogger } = require('../middlewares/logger');

//  импортируем контроллеры для создания User и Login
const { createUser, login } = require('../controllers/users.js');

// валидаторы запросов
const userCreateValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,32}$')),
    name: Joi.string().required().min(2).max(30),
  }),
});

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,32}$')),
  }),
});

const errCatcher = require('../middlewares/err-catcher');

const NotFoundError = require('../errors/not-found-err');

const errorNotFound = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(requestLogger);
router.use('/users', auth, routesUsers);
router.use('/articles', auth, routesArticles);
router.post('/signup', userCreateValid, createUser);
router.post('/signin', loginValid, login);
router.use(errorLogger);

router.use(errCatcher);
router.use(errorNotFound);
router.use(errors());

module.exports = router;
