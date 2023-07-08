/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('../utils/test_helper');
const app = require('../app');

const api = supertest(app);

const Category = require('../models/Category');

describe('/api/products/categories', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
    await Category.insertMany(helper.initialCategories);
  });

  describe('GET /api/products/categories', () => {
    it('should return product categories as JSON', async () => {
      const { _body } = await api
        .get('/api/products/categories')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const initialCategories = helper.initialCategories.map((category) => category._id);

      expect(_body).toHaveLength(initialCategories.length);
      expect(_body).toContain(initialCategories[0]);
    });

    describe('GET /api/products/categories/:category', () => {
      it('should return products by category filter as JSON', async () => {
        const products = await helper.productsInDb();
        const categoryFilter = products[0].category;
        const numberOfProductsByFilterInitially = products
          .filter((product) => product.category === categoryFilter);

        const { _body } = await api
          .get(`/api/products/categories/${categoryFilter}`)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(_body).toHaveLength(numberOfProductsByFilterInitially.length);
      });

      it('should work when filter is not lowercase', async () => {
        const categories = await helper.productCategoriesInDb();
        const firstCategory = categories[0].id;
        const filterCategoryUppercase = firstCategory.toUpperCase();

        const resultInproperlyTyped = await api
          .get(`/api/products/categories/${filterCategoryUppercase}`)
          .expect(200);

        const resultProperlyTyped = await api
          .get(`/api/products/categories/${firstCategory}`)
          .expect(200);

        expect(resultProperlyTyped._body).toHaveLength(resultInproperlyTyped._body.length);
      });

      it('should return 404 when category is not found', async () => {
        const { error } = await api
          .get('/api/products/categories/notacategory')
          .expect(404);

        expect(error.text).toContain('Category not found');
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
