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
      it('should return correct amount of subcategories', async () => {
        const { initialCategories } = helper;

        const { _body } = await api
          .get(`/api/products/categories/${initialCategories[0]._id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        const initialLength = initialCategories[0].subcategories;
        const receivedLength = _body.length;

        expect(initialLength).toHaveLength(receivedLength);
      });

      it('should return 404 "Category not found" when category doesnt exist', async () => {
        const { _body } = await api
          .get('/api/products/categories/imaginarycategory')
          .expect(404);

        expect(_body.error).toContain('Category not found');
      });

      it('should be case insensitive', async () => {
        const categoryName = 'cLoThInG';

        const { _body } = await api
          .get(`/api/products/categories/${categoryName}`)
          .expect(200);

        const initialClothingCategory = helper.initialCategories.find((x) => x._id === 'Clothing');
        const initialSubcategoryName = initialClothingCategory.subcategories[0].subcategoryName;

        expect(_body[0].subcategoryName).toContain(initialSubcategoryName);
      });
    });

    describe('GET /api/products/categories/q/:queryString', () => {
      it('should return 404 "Query must contain at least 3 characters"', async () => {
        const queryString = 'ab';

        const { error } = await api
          .get(`/api/products/categories/q/${queryString}`)
          .expect(404);

        expect(error.text).toContain('Query must contain at least 3 characters');
      });

      it('should be case insensitive', async () => {
        const queryString = 'gRiLl';

        const { _body } = await api
          .get(`/api/products/categories/q/${queryString}`)
          .expect(200);

        expect(_body).toHaveLength(1);
        expect(_body[0].name).toContain('Grill');
      });

      it('should contain fields name, apiCategory, icon', async () => {
        const queryString = 'bike';

        const { _body } = await api
          .get(`/api/products/categories/q/${queryString}`)
          .expect(200);

        expect(_body[0]).toHaveProperty('name');
        expect(_body[0]).toHaveProperty('apiCategory');
        expect(_body[0]).toHaveProperty('icon');
      });

      it('should return correct amount of results', async () => {
        const queryString = 'ill';

        const { _body } = await api
          .get(`/api/products/categories/q/${queryString}`)
          .expect(200);

        expect(_body).toHaveLength(2);
        expect(_body[0].name).toContain('Grill' || 'Illumination');
      });
    });

    describe('GET /api/products/categories/subcategories/q/:queryString', () => {
      it('should return 404 "Query must contain at least 3 characters"', async () => {
        const queryString = 'ab';

        const { error } = await api
          .get(`/api/products/categories/subcategories/q/${queryString}`)
          .expect(404);

        expect(error.text).toContain('Query must contain at least 3 characters');
      });

      it.only('should be case insensitive', async () => {
        const queryString = 'leCtR';

        const { _body } = await api
          .get(`/api/products/categories/subcategories/q/${queryString}`)
          .expect(200);

        expect(_body).toHaveLength(2);
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
