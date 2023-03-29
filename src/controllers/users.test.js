const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('../utils/test_helper');
const app = require('../app');

const api = supertest(app);

const User = require('../models/User');

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

  test('should return users as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('should return all users', async () => {
    const users = await api.get('/api/users');

    expect(users.body).toHaveLength(helper.initialUsers.length);
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
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
