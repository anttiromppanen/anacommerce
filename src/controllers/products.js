/* eslint-disable no-underscore-dangle */
const productsRouter = require('express').Router();
const Product = require('../models/Product');

productsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const productById = await Product.findById(id);

  if (!productById) {
    return res.status(404).json({ error: 'Item not found' });
  }

  return res.status(200).json(productById);
});

productsRouter.get('/', async (_req, res) => {
  const allProducts = await Product.find({});
  return res.status(200).json(allProducts);
});

module.exports = productsRouter;
