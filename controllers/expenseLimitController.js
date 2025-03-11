const ExpenseLimit = require('../models/expenseLimitModel');

exports.addBudgetLimit = (req, res) => {
    console.log("budget add called")
    const { category, amount, month, notes } = req.body;
    ExpenseLimit.create(category, amount, month, notes, (err) => {
        if (err) return res.status(500).json({ error: 'Please check if you have correctly entered the amount' });
        res.send('Budget limit added successfully');
    });
};

exports.getBudgetLimits = (req, res) => {
    console.log("Came here to get budget data")
    ExpenseLimit.findAll((err, budgetLimits) => {
        if (err) return res.status(500).json({ error: 'Error fetching budget limits' });
        res.json(budgetLimits);
    });
};
