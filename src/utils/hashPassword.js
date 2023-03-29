const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  const passwordHashed = await bcrypt.hash(password, saltRounds);

  return passwordHashed;
};

module.exports = {
  hashPassword,
};
