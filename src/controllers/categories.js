const categoriesRouter = require('express').Router();
const Category = require('../models/Category');

const helpers = require('../utils/helpers');

categoriesRouter.get('/', async (req, res) => {
  const allCategories = await Category.find().distinct('_id');
  res.status(200).json(allCategories);
});

categoriesRouter.get('/:category', async (req, res) => {
  const { category } = req.params;
  const categoryUpperCase = helpers.capitalizeString(category);

  const filterByCategory = await Category.findById(categoryUpperCase);
  const allSubcategories = filterByCategory.subcategories;

  if (allSubcategories.length === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.status(200).json(allSubcategories);
});

module.exports = categoriesRouter;
