const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const productsRouter = require('./controllers/products');
const statsRouter = require('./controllers/stats');
const categoriesRouter = require('./controllers/categories');
const searchbarRouter = require('./controllers/searchbar');

mongoose.set('strictQuery', false);

const app = express();
app.use(cors());

logger.info(`Connecting to ${config.MONGODB_URI}`);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB: ', error.message);
  });

app.use(express.json());
morgan('tiny');

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/products/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/searchbar', searchbarRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
