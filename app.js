const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const AppError = require('./utils/AppError');
const errHandler = require('./controllers/errorController');

const app = express();

app.use(cors({ origin: 'https://mikepostapp.herokuapp.com' }));
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', cors(), feedRoutes);
app.use('/feed', cors(), feedRoutes);
app.use('/auth', cors(), authRoutes);

app.use('*', (req, res, next) => {
  return next(
    new AppError(`can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(errHandler.errHandler);

module.exports = app;
