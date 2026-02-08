const mongoose = require('mongoose');
const { mongoUrl } = require('../../config/env');

const connect = async () => {
  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB');
};

const getConnectionState = () => mongoose.connection.readyState;

module.exports = {
  mongoose,
  connect,
  getConnectionState
};
