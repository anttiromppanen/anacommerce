/* eslint-disable no-unused-vars */
const axios = require('axios');
const searchbarRouter = require('express').Router();
const sortAlgorithm = require('../utils/searchbarSortAlgorithm');

const baseUrl = 'http://localhost:3001/api';

searchbarRouter.get('/', async (req, res) => {
  const { searchQuery } = req.query;
  const productsResult = await axios.get(`${baseUrl}/products/q/${searchQuery}`);
  const categoriesResult = await axios.get(`${baseUrl}/products/categories/q/${searchQuery}`);
  const subcategoriesResult = await axios.get(`${baseUrl}/products/categories/subcategories/q/${searchQuery}`);
  const allResults = productsResult.data.concat(categoriesResult.data, subcategoriesResult.data);

  const sortedResults = allResults
    .map((result) => ({
      ...result,
      sortScore: sortAlgorithm(
        result.name.toLowerCase(),
        searchQuery.toLowerCase(),
        result.apiCategory.toLowerCase(),
      ),
    }));

  sortedResults.sort((a, b) => a.sortScore - b.sortScore);

  return res.status(200).json(sortedResults.slice(0, 10));
});

module.exports = searchbarRouter;
