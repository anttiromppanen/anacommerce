/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

const User = require('../models/User');
const Order = require('../models/Order');

const testUser = {
  id: 'logintestuser@luukku.com',
  firstName: 'Seppo',
  lastName: 'Paju',
  password: 'testpassword1',
  address: {
    country: 'Finland',
    street1: 'Koljosenkatu 33',
    street2: 'A11',
    city: 'Helsinki',
    zip: '00360',
  },
  shippingAddress: {
    country: 'Finland',
    street1: 'Koljosenkatu 33',
    street2: 'A11',
    city: 'Helsinki',
    zip: '00360',
  },
  orders: [],
};

describe('/api/login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Order.deleteMany({});

    await api
      .post('/api/users')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  it('should fail 401 with incorrect username and password', async () => {
    const credentials = { username: 'wrongemail@luuk.com', password: 'wrongpassword' };

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(401);

    expect(response.error.text).toContain('invalid username or password');
  });

  it('should fail 401 with correct username and incorrect password', async () => {
    const credentials = {
      username: 'logintestuser@luukku.com',
      password: 'testpassword12',
    };

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(401);

    expect(response.error.text).toContain('invalid username or password');
  });

  it('should success 200 with correct credentials', async () => {
    const credentials = {
      username: 'logintestuser@luukku.com',
      password: 'testpassword1',
    };

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(200);

    expect(response._body.token).toBeDefined();
    expect(response._body.firstName).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
