const productsRouter = require('express').Router();
const Product = require('../models/Product');

productsRouter.get('/', async (_req, res) => {
  const allProducts = await Product.find({});
  return res.status(201).json(allProducts);
});

productsRouter.get('/categories', async (req, res) => {
  const allCategories = await Product.find().distinct('category');
  res.status(201).json(allCategories);
});

productsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const productById = await Product.findById(id);

  if (!productById) {
    return res.status(404).json({ error: 'Item not found' });
  }

  return res.status(201).json(productById);
});

module.exports = productsRouter;
