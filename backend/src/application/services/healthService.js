const { getConnectionState } = require('../../infrastructure/db/mongoose');

const getStatus = () => (getConnectionState() === 1 ? 'up' : 'down');

module.exports = {
  getStatus
};
