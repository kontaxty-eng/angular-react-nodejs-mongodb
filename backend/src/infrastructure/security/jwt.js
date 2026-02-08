const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/env');

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), email: user.email }, jwtSecret, {
    expiresIn: '1h'
  });

const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = {
  signToken,
  verifyToken
};
