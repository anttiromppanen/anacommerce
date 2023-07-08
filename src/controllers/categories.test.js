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
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
