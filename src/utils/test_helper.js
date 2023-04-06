const User = require('../models/User');
const Product = require('../models/Product');

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

const initialProducts = [
  {
    name: 'Carrot',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Molestie at elementum eu facilisis sed odio morbi quis commodo. Vel pretium lectus quam id leo in vitae turpis.',
    category: 'Food',
    subCategory: 'Vegetable',
    skus: [
      {
        weight: 0.2,
        originCountry: 'Guatemala',
        quantity: 200,
      },
      {
        weight: 0.4,
        originCountry: 'Suomi',
        quantity: 400,
      },
    ],
    images: ['https://www.asdfasdfasdfasdf.com/img1', 'https://www.asfdjsafdasfjl.com/img2'],
  },
  {
    name: 'Jacket',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Molestie at elementum eu facilisis sed odio morbi quis commodo',
    category: 'Clothing',
    subCategory: 'Jacket',
    skus: [
      {
        weight: 0.7,
        originCountry: 'Sweden',
        quantity: 656,
      },
      {
        weight: 0.2,
        originCountry: 'Poland',
        quantity: 324,
      },
    ],
    images: ['https://www.asdfasdfas.com/img1', 'https://www.asfdjs.com/img2'],
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const productsInDb = async () => {
  const products = await Product.find({});
  return products.map((product) => product.toJSON());
};

module.exports = {
  initialUsers,
  initialProducts,
  usersInDb,
  productsInDb,
};
