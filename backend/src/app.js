const express = require('express');
const cors = require('cors');
const routes = require('./presentation/routes');
const errorHandler = require('./presentation/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Global error handler - must be after routes
app.use(errorHandler);

module.exports = app;
