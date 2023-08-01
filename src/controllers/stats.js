/* eslint-disable no-underscore-dangle */
const statsRouter = require('express').Router();

const Product = require('../models/Product');
const Order = require('../models/Order');

const { caseInsensitiveSearch, roundDownIfResultNotZero } = require('../utils/helpers');

statsRouter.get('/mostsold', async (_req, res) => {
  const top10MostSoldProductsFromDb = await Order.get10MostSoldProducts();

  const productIds = top10MostSoldProductsFromDb.map((product) => product._id);
  const top10MostSoldProducts = await Product.find({ _id: { $in: productIds } });

  res.status(200).json(top10MostSoldProducts);
});

statsRouter.get('/minmaxpricebysubcategory/:subcategory', async (req, res) => {
  const { subcategory } = req.params;
  const productsBySubcategory = await Product
    .find({ subCategory: caseInsensitiveSearch(subcategory) })
    .sort({ price: 1 });

  if (!productsBySubcategory) {
    return res.status(404).json({ error: 'No products found' });
  }

  if (productsBySubcategory.length === 1) {
    return res.status(200).json({
      minPrice: roundDownIfResultNotZero(productsBySubcategory[0].price),
      maxPrice: Math.ceil(productsBySubcategory[0].price),
    });
  }

  const minAndMaxPricedProducts = {
    minPrice: roundDownIfResultNotZero(productsBySubcategory[0].price),
    maxPrice: Math.ceil(productsBySubcategory[productsBySubcategory.length - 1].price),
  };

  return res.status(200).json(minAndMaxPricedProducts);
});

statsRouter.get('/minmaxweightbysubcategory/:subcategory', async (req, res) => {
  const { subcategory } = req.params;
  const productsBySubcategory = await Product.aggregate([
    {
      $match: { subCategory: caseInsensitiveSearch(subcategory) },
    },
    {
      $unwind: '$skus',
    },
    {
      $sort: { 'skus.weight': 1 },
    },
  ]);

  if (!productsBySubcategory) {
    return res.status(404).json({ error: 'No products found' });
  }

  if (productsBySubcategory.length === 1) {
    return res.status(200).json({
      minWeight: roundDownIfResultNotZero(productsBySubcategory[0].skus.weight),
      maxWeight: Math.ceil(productsBySubcategory[0].skus.weight),
    });
  }

  const minAndMaxWeights = {
    minWeight: roundDownIfResultNotZero(productsBySubcategory[0].skus.weight),
    maxWeight: Math.ceil(productsBySubcategory[productsBySubcategory.length - 1].skus.weight),
  };

  return res.status(200).json(minAndMaxWeights);
});

module.exports = statsRouter;
