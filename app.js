require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { NODE_ENV, DATABASE_ADRESS, PORT = 3000 } = process.env;
const app = express();

const cors = require('cors');

const whitelist = ['http://localhost:8080', 'https://shishovka.github.io/news-explorer-frontend', 'https://shishovka.github.io'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

mongoose.connect(NODE_ENV === 'production' ? DATABASE_ADRESS : 'mongodb://localhost:27017/newsExplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//  импортируем роуты
const mainRouter = require('./routes/index');

app.use(mainRouter);

app.listen(PORT);
