const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const NotFoundError = require('../errors/not-found-err');
const SameEmailError = require('../errors/same-email-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        const sendUser = JSON.parse(JSON.stringify(user));
        delete sendUser.password;
        res.send({ data: sendUser });
      }))
    .catch((err) => {
      if ((err.code === 11000) && (err.name === 'MongoError')) {
        next(new SameEmailError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.FindUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new NotFoundError(err.message));
    });
};

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((me) => {
      if (!me) throw new NotFoundError('Нет пользователя с таким id');
      res.send({ data: me });
    })
    .catch(next);
};
