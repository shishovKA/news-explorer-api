require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/newsExplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send({ message: 'bad JSON' });
  } else {
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

//  обработчик несуществующего пут
const errorNotFound = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

//  импортируем роуты
const routesUsers = require('./routes/users.js');
const routesArticles = require('./routes/articles.js');

//  импортируем контроллеры для создания User и Login
const { createUser, login } = require('./controllers/users.js');

// импортируем мидлвары
const auth = require('./middlewares/auth');
const errCatcher = require('./middlewares/err-catcher');

// валидаторы запросов
const userCreateValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().token().min(8).max(100),
    name: Joi.string().required().min(2).max(30),
  }),
});

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().token().min(8)
      .max(100),
  }),
});


app.use(requestLogger);

app.use('/users', auth, routesUsers);
app.use('/articles', auth, routesArticles);

app.post('/signup', userCreateValid, createUser);
app.post('/signin', loginValid, login);

app.use(errorLogger);

app.use(errorNotFound);
app.use(errors()); // обработчик ошибок celebrate
app.use(errCatcher);

app.listen(PORT);


