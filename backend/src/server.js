const app = require('./app');
const { connect } = require('./infrastructure/db/mongoose');
const { port } = require('./config/env');

const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
