require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { NODE_ENV, DATABASE_ADRESS, PORT = 3000 } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? DATABASE_ADRESS : 'mongodb://localhost:27017/newsExplorer' , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//  импортируем роуты
const mainRouter = require('./routes/index');

app.use(mainRouter);

app.listen(PORT);


