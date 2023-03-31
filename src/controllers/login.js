const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findById(username);
  const passwordCorrect = user && await bcrypt.compare(password, user.hashedPassword);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    firstName: user.firstName,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  return res
    .status(200)
    .send({ token, firstName: user.firstName });
});

module.exports = loginRouter;
