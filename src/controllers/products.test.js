/* eslint-disable no-underscore-dangle */
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
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const productsAtEnd = await helper.productsInDb();
      expect(productsAtEnd).toHaveLength(helper.initialProducts.length);
    });

    it('should omit id and version fields', async () => {
      const { _body } = await api
        .get('/api/products')
        .expect(200);

      expect(_body[0]).not.toHaveProperty('_id');
      expect(_body[0]).not.toHaveProperty('__v');
    });

    it('should contain all required fields', async () => {
      const { _body } = await api
        .get('/api/products')
        .expect(200);

      const firstProduct = _body[0];

      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('description');
      expect(firstProduct).toHaveProperty('category');
      expect(firstProduct).toHaveProperty('skus');
      expect(firstProduct).toHaveProperty('images');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return correct product by id', async () => {
      const products = await Product.find({});
      const { _id } = products[0];

      const { _body } = await api
        .get(`/api/products/${_id}`)
        .expect(200);

      const initialProducts = await helper.productsInDb();
      const initialProductNames = initialProducts.map((product) => product.name);

      const initialProduct = initialProducts.find((product) => product.name === _body.name);

      expect(initialProductNames).toContain(_body.name);
      expect(initialProduct.name).toEqual(_body.name);
      expect(initialProduct.description).toEqual(_body.description);
    });

    it('should return 404 when item not found', async () => {
      const products = await helper.productsInDb();
      const firstProductIdModified = products[0]
        .id
        .replace('a', 'b');

      const { error } = await api
        .get(`/api/products/${firstProductIdModified}`)
        .expect(404);

      expect(error.text).toContain('Item not found');
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return product categories as JSON', async () => {
      const { _body } = await api
        .get('/api/products/categories')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const productTypesFromAddedItems = helper.initialProducts.map((product) => product.category);

      expect(_body).toHaveLength(productTypesFromAddedItems.length);
      expect(_body).toContain(productTypesFromAddedItems[0]);
    });
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
      const firstCategory = categories[0];
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

afterAll(async () => {
  await mongoose.connection.close();
});
