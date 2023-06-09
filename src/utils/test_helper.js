/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

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
    price: 29.99,
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
    price: 45.99,
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

const initialOrders = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: initialUsers[0]._id,
    paymentStatus: 'Complete',
    status: 'Delivered',
    amount: 50,
    items: [
      {
        productId: new mongoose.Types.ObjectId(),
        name: 'Teflon pan',
        quantity: 1,
        price: 39.99,
        discountPercentage: 0,
      },
      {
        productId: new mongoose.Types.ObjectId(),
        name: 'Apron',
        quantity: 2,
        price: 15.99,
        discountPercentage: 5,
      },
    ],
    shippingAddress: {
      country: 'Finland',
      street1: 'Koskikatu 1',
      street2: 'A45',
      city: 'Joensuu',
      zip: '80100',
    },
    billingAddress: {
      country: 'Finland',
      street1: 'Koskikatu 1',
      street2: 'A45',
      city: 'Joensuu',
      zip: '80100',
    },
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: initialUsers[1]._id,
    paymentStatus: 'Pending',
    status: 'Ready',
    amount: 100,
    items: [
      {
        productId: new mongoose.Types.ObjectId(),
        name: 'Phone charger',
        quantity: 1,
        price: 40,
        discountPercentage: 0,
      },
      {
        productId: new mongoose.Types.ObjectId(),
        name: 'Baseball bat',
        quantity: 10,
        price: 30,
        discountPercentage: 0,
      },
    ],
    shippingAddress: {
      country: 'Finland',
      street1: 'Paavonkatu 33',
      street2: 'B34',
      city: 'Inari',
      zip: '00034',
    },
    billingAddress: {
      country: 'Finland',
      street1: 'Paavonkatu 33',
      street2: 'B34',
      city: 'Inari',
      zip: '00034',
    },
  },
];

const initialCategories = [
  {
    _id: 'Food',
    subcategories: [
      {
        subcategoryIcon: 'www.someimagetesttest.com',
        subcategoryName: 'Fruit',
      },
      {
        subcategoryIcon: 'www.someimagetesttest2.com',
        subcategoryName: 'Vegetable',
      },
    ],
  },
  {
    _id: 'Bike',
    subcategories: [
      {
        subcategoryIcon: 'www.somebikeimage.com',
        subcategoryName: 'Mountain Bike',
      },
      {
        subcategoryIcon: 'www.someelectricimage.com/1234',
        subcategoryName: 'Electric Bike',
      },
    ],
  },
  {
    _id: 'Clothing',
    subcategories: [
      {
        subcategoryIcon: 'www.sometieimage.com',
        subcategoryName: 'Tie',
      },
      {
        subcategoryIcon: 'www.someshirt.com/1234',
        subcategoryName: 'Shirt',
      },
    ],
  },
  {
    _id: 'Grill',
    subcategories: [
      {
        subcategoryIcon: 'www.somegrillimage.com',
        subcategoryName: 'Gas Grill',
      },
      {
        subcategoryIcon: 'www.somegasgrillimage.com',
        subcategoryName: 'Electric Grill',
      },
    ],
  },
  {
    _id: 'Illumination',
    subcategories: [
      {
        subcategoryIcon: 'www.someilluminationimage.com',
        subcategoryName: 'Lightbulb',
      },
      {
        subcategoryIcon: 'www.sometablelamb.com',
        subcategoryName: 'Table Lamb',
      },
    ],
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

const ordersInDb = async () => {
  const orders = await Order.find({});
  return orders.map((order) => order.toJSON());
};

const productCategoriesInDb = async () => {
  const categories = await Category.find({});
  return categories.map((category) => category.toJSON());
};

module.exports = {
  initialUsers,
  initialProducts,
  initialOrders,
  initialCategories,
  usersInDb,
  productsInDb,
  ordersInDb,
  productCategoriesInDb,
};
