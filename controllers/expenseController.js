// /controllers/expenseController.js - Expense Logic
const Expense = require('../models/Expense');

exports.getExpenses = (req, res) => {
    Expense.getAll((err, expenses) => {
        if (err) return res.status(500).json({ error: 'Error fetching expenses' });
        res.json(expenses);
    });
};

exports.addExpense = (req, res) => {
    const { title, amount, category, date } = req.body;
    Expense.create(title, amount, category, date, null, (err) => {
        if (err) return res.status(500).send('Error adding expense');
        res.send('Expense added successfully');
    });
};

exports.deleteExpense = (req, res) => {
    const { id } = req.params;
    Expense.delete(id, (err) => {
        if (err) return res.status(500).send('Error deleting expense');
        res.send('Expense deleted successfully');
    });
};
