const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const seedRoutes = require('./seed');

const router = express.Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/seed', seedRoutes);

module.exports = router;
