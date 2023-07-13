/* eslint-disable no-underscore-dangle */
const productsRouter = require('express').Router();
const Product = require('../models/Product');

const { caseInsensitiveSearch } = require('../utils/helpers');

productsRouter.get('/q/:queryString', async (req, res) => {
  const { queryString } = req.params;

  if (queryString.length < 2) {
    return res.status(404).json({ error: 'Query must contain at least 3 characters' });
  }

  const result = await Product.find({ name: caseInsensitiveSearch(queryString) });
  const resultInCorrectForm = result.map((product) => (
    {
      name: product.name,
      apiCategory: 'products',
      icon: product.images[0],
    }
  ));

  return res.status(200).json(resultInCorrectForm);
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
