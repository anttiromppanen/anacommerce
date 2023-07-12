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
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
