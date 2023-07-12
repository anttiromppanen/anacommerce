const categoriesRouter = require('express').Router();
const Category = require('../models/Category');

const { caseInsensitiveSearch } = require('../utils/helpers');

categoriesRouter.get('/', async (_req, res) => {
  const allCategories = await Category.find().distinct('_id');
  res.status(200).json(allCategories);
});

categoriesRouter.get('/:category', async (req, res) => {
  const { category } = req.params;
  const filterByCategory = await Category.findById(caseInsensitiveSearch(category));

  if (!filterByCategory) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const allSubcategories = filterByCategory.subcategories;
  return res.status(200).json(allSubcategories);
});

module.exports = categoriesRouter;
