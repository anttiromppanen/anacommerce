const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();
const { hashPassword } = require('../utils/hashPassword');
const User = require('../models/User');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }

  return null;
};

usersRouter.get('/:id', async (req, res) => {
  const userID = req.params.id;
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(userID).select('-hashedPassword');

  if (!user) {
    return res.status(404).end();
  }

  delete user.hashedPassword;
  return res.json(user);
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
