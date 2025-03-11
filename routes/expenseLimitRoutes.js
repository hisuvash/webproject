const express = require('express');
const router = express.Router();
const expenseLimitController = require('../controllers/expenseLimitController');

router.post('/add', expenseLimitController.addBudgetLimit);
router.get('/get', expenseLimitController.getBudgetLimits);

module.exports = router;
