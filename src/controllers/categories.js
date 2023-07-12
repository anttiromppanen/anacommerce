/* eslint-disable no-underscore-dangle */
const categoriesRouter = require('express').Router();
const Category = require('../models/Category');

const { caseInsensitiveSearch } = require('../utils/helpers');

categoriesRouter.get('/subcategories/q/:queryString', async (req, res) => {
  const { queryString } = req.params;

  // if (queryString.length < 3) {
  //  return res.status(404).json({ error: 'Query must contain at least 3 characters' });
  // }

  const result = await Category.aggregate([{ $unwind: '$subcategories' }]);

  const resultFilteredByQuery = result
    .filter((category) => category.subcategories.subcategoryName.toLowerCase()
      .includes(queryString.toLowerCase()));

  const resultInCorrectForm = resultFilteredByQuery.map((x) => (
    {
      name: x.subcategories.subcategoryName,
      apiCategory: 'subcategory',
      icon: x.subcategories.subcategoryIcon,
    }
  ));

  return res.status(200).json(resultInCorrectForm);
});

categoriesRouter.get('/q/:queryString', async (req, res) => {
  const { queryString } = req.params;

  // if (queryString.length < 3) {
  //  return res.status(404).json({ error: 'Query must contain at least 3 characters' });
  // }

  const result = await Category.find({ _id: caseInsensitiveSearch(queryString) });
  const resultInCorrectForm = result.map((category) => (
    {
      name: category._id,
      apiCategory: 'category',
      icon: null,
    }
  ));

  return res.status(200).json(resultInCorrectForm);
});

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
