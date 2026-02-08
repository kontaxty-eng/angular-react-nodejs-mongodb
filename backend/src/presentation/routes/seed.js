const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');

// POST /api/seed - Seed database with sample tasks
router.post('/', seedController.seed);

module.exports = router;
