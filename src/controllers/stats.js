/* eslint-disable no-underscore-dangle */
const statsRouter = require('express').Router();

const Product = require('../models/Product');
const Order = require('../models/Order');

statsRouter.get('/mostsold', async (_req, res) => {
  const top10MostSoldProductsFromDb = await Order.get10MostSoldProducts();

  const productIds = top10MostSoldProductsFromDb.map((product) => product._id);
  const top10MostSoldProducts = await Product.find({ _id: { $in: productIds } });

  res.status(200).json(top10MostSoldProducts);
});

module.exports = statsRouter;
