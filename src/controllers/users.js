const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { body } = req;

  // not done yet
  const passwordHashed = body.password;

  const newUser = new User({
    _id: body.id,
    firstName: body.firstName,
    lastName: body.lastName,
    hashedPassword: passwordHashed,
    address: body.address,
    shippingAddress: body.shippingAddress,
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
