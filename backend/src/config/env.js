require('dotenv').config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/appdb';
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
const port = process.env.PORT || 3000;

module.exports = {
  mongoUrl,
  jwtSecret,
  port
};
