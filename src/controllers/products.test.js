const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('../utils/test_helper');
const app = require('../app');

const api = supertest(app);

const Product = require('../models/Product');

describe('/api/products', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    await Product.insertMany(helper.initialProducts);
  });

  describe('GET /api/products', () => {
    it('should return all products as JSON', async () => {
      await api
        .get('/api/products')
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const productsAtEnd = await helper.productsInDb();
      expect(productsAtEnd).toHaveLength(helper.initialProducts.length);
    });

    it('should omit id and version fields', async () => {
      const { _body } = await api
        .get('/api/products')
        .expect(201);

      expect(_body[0]).not.toHaveProperty('_id');
      expect(_body[0]).not.toHaveProperty('__v');
    });

    it('should contain all required fields', async () => {
      const { _body } = await api
        .get('/api/products')
        .expect(201);

      const firstProduct = _body[0];

      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('description');
      expect(firstProduct).toHaveProperty('skus');
      expect(firstProduct).toHaveProperty('images');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return correct product by id', async () => {

    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
