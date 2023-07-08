const categoriesRouter = require('express').Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

categoriesRouter.get('/', async (req, res) => {
  const allCategories = await Category.find().distinct('_id');
  res.status(200).json(allCategories);
});

categoriesRouter.get('/:category', async (req, res) => {
  const { category } = req.params;
  const categoryLowercase = category.toLowerCase();
  const categoryUpperCase = categoryLowercase
    .charAt(0)
    .toUpperCase()
    + categoryLowercase.slice(1);

  const productsByCategory = await Product
    .find({ category: categoryUpperCase });

  if (productsByCategory.length === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.status(200).json(productsByCategory);
});

module.exports = categoriesRouter;
