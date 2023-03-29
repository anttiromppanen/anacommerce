const usersRouter = require('express').Router();
const { hashPassword } = require('../utils/hashPassword');
const User = require('../models/User');

usersRouter.get('/', async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { body } = req;

  if (!body.password) {
    return res.status(400).json({ error: 'User validation failed: password: Path `password` is required.' });
  }

  const passwordHashed = await hashPassword(body.password);

  if (String(passwordHashed) === String(body.password)) {
    return res.status(400).json({ error: 'Error with storing information' });
  }

  const newUser = new User({
    _id: body.id,
    firstName: body.firstName,
    lastName: body.lastName,
    hashedPassword: passwordHashed,
    address: body.address,
    shippingAddress: body.shippingAddress,
  });

  const savedUser = await newUser.save();
  return res.status(201).json(savedUser);
});

module.exports = usersRouter;
