/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('../utils/test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/User');
const Order = require('../models/Order');

let testUser = null;

describe('/api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);

    testUser = {
      id: 'testuser666@hotmail.com',
      firstName: 'Kalle',
      lastName: 'Laitela',
      password: 'asdfjbvjlkxcvb345lkjolkj',
      address: {
        country: 'Finland',
        street1: 'Kotikatu 12',
        street2: 'B15',
        city: 'Helsinki',
        zip: '00300',
      },
      shippingAddress: {
        country: 'Finland',
        street1: 'Pertunkatu',
        street2: 'B17',
        city: 'Rauma',
        zip: '01000',
      },
    };
  });

  describe('POST /api/users', () => {
    it('should success with valid information', async () => {
      await api
        .post('/api/users')
        .send(testUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

      const emails = usersAtEnd.map((x) => x.id);
      expect(emails).toContain('testuser666@hotmail.com');
    });

    it('should not store password unhashed', async () => {
      await api
        .post('/api/users')
        .send(testUser)
        .expect(201);

      const usersAtEnd = await helper.usersInDb();
      const addedUser = usersAtEnd.find((x) => x.id === testUser.id);

      expect(addedUser.hashedPassword).not.toEqual(testUser.password);
    });

    describe('fails when fields are missing', () => {
      it('should fail when id is missing', async () => {
        testUser.id = null;

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;
        expect(errorText).toContain('User validation failed: _id');
      });

      it('should fail when firstName is missing', async () => {
        testUser.firstName = null;

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;
        expect(errorText).toContain('User validation failed: firstName');
      });

      it('should fail when lastName is missing', async () => {
        testUser.lastName = null;

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;
        expect(errorText).toContain('User validation failed: lastName');
      });

      it('should fail when hashedPassword is missing', async () => {
        testUser.password = null;

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;
        expect(errorText).toContain('User validation failed: password');
      });

      describe('address object', () => {
        it('should fail when address is missing', async () => {
          testUser.address = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed');
        });

        it('should fail when country is missing', async () => {
          testUser.address.country = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: address.country');
        });

        it('should fail when street1 is missing', async () => {
          testUser.address.street1 = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: address.street1');
        });

        it('should not fail when optional field street2 is missing', async () => {
          testUser.address.street2 = null;

          await api
            .post('/api/users')
            .send(testUser)
            .expect(201);

          const usersAtEnd = await helper.usersInDb();
          const emails = usersAtEnd.map((x) => x.id);

          expect(emails).toContain(testUser.id);
        });

        it('should fail when city is missing', async () => {
          testUser.address.city = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: address.city');
        });

        it('should fail when zip is missing', async () => {
          testUser.address.zip = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: address.zip');
        });
      });

      it('should fail when id (email) is already registered', async () => {
        await api
          .post('/api/users')
          .send(testUser)
          .expect(201);

        const testUserWithIdenticalId = {
          id: 'testuser666@hotmail.com',
          firstName: 'Tauno',
          lastName: 'Palo',
          password: 'gsdlfgjhksdfh45sglöfkj4',
          address: {
            country: 'Finland',
            street1: 'Jokukatu 25',
            street2: 'A15',
            city: 'Helsinki',
            zip: '00100',
          },
          shippingAddress: {
            country: 'Finland',
            street1: 'Taunonkatu 76',
            city: 'Rauma',
            zip: '01100',
          },
        };

        const response = await api
          .post('/api/users')
          .send(testUserWithIdenticalId)
          .expect(500);

        expect(response.error.text).toContain('email already registered');
      });

      describe('shippingAddress object', () => {
        it('should fail when shippingAddress is missing', async () => {
          testUser.shippingAddress = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed');
        });

        it('should fail when country is missing', async () => {
          testUser.shippingAddress.country = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: shippingAddress.country');
        });

        it('should fail when street1 is missing', async () => {
          testUser.shippingAddress.street1 = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: shippingAddress.street1');
        });

        it('should not fail when optional field street2 is missing', async () => {
          testUser.shippingAddress.street2 = null;

          await api
            .post('/api/users')
            .send(testUser)
            .expect(201);

          const usersAtEnd = await helper.usersInDb();
          const emails = usersAtEnd.map((x) => x.id);

          expect(emails).toContain(testUser.id);
        });

        it('should fail when city is missing', async () => {
          testUser.shippingAddress.city = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: shippingAddress.city');
        });

        it('should fail when zip is missing', async () => {
          testUser.shippingAddress.zip = null;

          const response = await api
            .post('/api/users')
            .send(testUser)
            .expect(400);

          const errorText = response.error.text;
          expect(errorText).toContain('User validation failed: shippingAddress.zip');
        });
      });
    });

    describe('fails when fields don\'t meet minlength requirement', () => {
      it('should fail when id (email) is too short', async () => {
        testUser.id = 'a@co';

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;

        expect(errorText).toContain('_id');
        expect(errorText).toContain('is shorter than the minimum allowed length');
      });

      it('should fail when firstName is too short', async () => {
        testUser.firstName = 'a';

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;

        expect(errorText).toContain('firstName');
        expect(errorText).toContain('is shorter than the minimum allowed length');
      });

      it('should fail when lastName is too short', async () => {
        testUser.lastName = 'b';

        const response = await api
          .post('/api/users')
          .send(testUser)
          .expect(400);

        const errorText = response.error.text;

        expect(errorText).toContain('lastName');
        expect(errorText).toContain('is shorter than the minimum allowed length');
      });
    });

    describe('fetching of individual user information', () => {
      it('should fail when token not given', async () => {
        const users = await helper.usersInDb();

        const response = await api
          .get(`/api/users/${users[0].id}`)
          .expect(401);

        expect(response.error.text).toContain('invalid token');
      });

      it('should return user information when correct token is given', async () => {
        await api
          .post('/api/users')
          .send(testUser)
          .expect(201);

        const savedUserLogin = await api
          .post('/api/login')
          .send({ username: testUser.id, password: testUser.password })
          .expect(200);

        const { token } = savedUserLogin._body;

        const response = await api
          .get(`/api/users/${testUser.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response._body).toBeTruthy();
        expect(response._body).not.toHaveProperty('hashedPassword');
      });
    });

    describe('orders field', () => {
      it('should populate orders from orders collection when user is added', async () => {
        await Order.deleteMany({});
        await Order.insertMany(helper.initialOrders);
        const orders = await Order.find({});
        testUser.orders = [orders[0]._id];

        const { body } = await api
          .post('/api/users')
          .send(testUser)
          .expect(201);

        expect(body.orders).toHaveLength(1);
        expect(body.orders[0]).toHaveProperty('id');
        expect(body.orders[0]).toHaveProperty('userId');
        expect(body.orders[0]).toHaveProperty('status');
      });

      it('should populate orders when GET user', async () => {
        await Order.deleteMany({});
        await Order.insertMany(helper.initialOrders);
        const orders = await Order.find({});
        testUser.orders = [orders[0]._id];

        const { body } = await api
          .post('/api/users')
          .send(testUser)
          .expect(201);

        const savedUserLogin = await api
          .post('/api/login')
          .send({ username: testUser.id, password: testUser.password })
          .expect(200);

        const { token } = savedUserLogin._body;

        const { _body } = await api
          .get(`/api/users/${body.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(_body.orders).toHaveLength(1);
        expect(_body.orders[0]).toHaveProperty('id');
        expect(_body.orders[0]).toHaveProperty('userId');
        expect(_body.orders[0]).toHaveProperty('status');
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
