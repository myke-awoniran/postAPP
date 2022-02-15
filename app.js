const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const app = express();
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const errHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.get('/', feedRoutes);
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use('*', (req, res, next) => {
  return next(
    new AppError(`can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(errHandler.errHandler);

module.exports = app;
