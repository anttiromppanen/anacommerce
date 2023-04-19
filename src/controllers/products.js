/* eslint-disable no-underscore-dangle */
const productsRouter = require('express').Router();
const Product = require('../models/Product');

productsRouter.get('/categories', async (req, res) => {
  const allCategories = await Product.find().distinct('category');
  res.status(200).json(allCategories);
});

productsRouter.get('/categories/:category', async (req, res) => {
  const { category } = req.params;
  const categoryLowercase = category.toLowerCase();
  const categoryUpperCase = categoryLowercase
    .charAt(0)
    .toUpperCase()
    + categoryLowercase.slice(1);

  const productsByCategory = await Product.find({ category: categoryUpperCase });

  if (productsByCategory.length === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.status(200).json(productsByCategory);
});

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
