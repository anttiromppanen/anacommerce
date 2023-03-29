const User = require('../models/User');

const initialUsers = [
  {
    _id: 'user1@gmail.com',
    firstName: 'Jari',
    lastName: 'Tervo',
    hashedPassword: 'asdfasdfasdf435345asdfasdfasdf',
    address: {
      country: 'Finland',
      street1: 'Kalervonkatu 35',
      street2: 'A12',
      city: 'Helsinki',
      zip: '00320',
    },
    shippingAddress: {
      country: 'Finland',
      street1: 'Unioninkatu 14',
      street2: 'B33',
      city: 'Helsinki',
      zip: '00310',
    },
  },
  {
    _id: 'testuser34@gmail.com',
    firstName: 'Seppo',
    lastName: 'Paljumäki',
    hashedPassword: 'ajaslkdfjaklsfösfdajlkö4235',
    address: {
      country: 'Finland',
      street1: 'Teponkatu 33',
      street2: 'C34',
      city: 'Turku',
      zip: '00500',
    },
    shippingAddress: {
      country: 'Finland',
      street1: 'Tanelinkatu',
      street2: 'B4',
      city: 'Porvoo',
      zip: '00450',
    },
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  usersInDb,
};
