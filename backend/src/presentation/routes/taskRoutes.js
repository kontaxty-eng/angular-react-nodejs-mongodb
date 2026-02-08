const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', taskController.list);
router.post('/', taskController.create);
router.patch('/:id', taskController.update);

module.exports = router;
