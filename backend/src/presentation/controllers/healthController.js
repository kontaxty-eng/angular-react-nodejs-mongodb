const healthService = require('../../application/services/healthService');

const health = (req, res) => {
  const status = healthService.getStatus();
  res.json({ status });
};

module.exports = {
  health
};
