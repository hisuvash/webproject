// /controllers/expenseController.js - Expense Logic
const Expense = require('../models/Expense');
const db = require('../config/database');

exports.getExpenses = (req, res) => {
    Expense.getAll((err, expenses) => {
        if (err) return res.status(500).json({ error: 'Error fetching expenses' });
        res.json(expenses);
    });
};

exports.addExpense = (req, res) => {
    const { title, amount, category, date } = req.body;
    console.log("Received request body:", req.body)
    console.log(req.file)
    const receipt = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("I am in add expense1")
    Expense.create(title, amount, category, date, receipt, (err) => {
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

// exports.getExpense = (req, res) => {
//     console.log("I came to give single expense")
//     const { id } = req.params;
//     Expense.getById(id, (err, expense) => {
//         if (err || !expense) return res.status(404).json({ error: 'Expense not found' });
//         console.log("From get expense", expense)
//         res.json(expense);
//     });
// };





exports.getExpense = (req, res) => {
    console.log("I came to give single expense");

    const { id } = req.params;

    Expense.getById(id, (err, expense) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!expense || Object.keys(expense).length === 0) {
            console.warn("Expense not found for ID:", id);
            return res.status(404).json({ error: 'Expense not found' });
        }

        // console.log("Expense retrieved:", expense);
        res.json(expense);
    });
};

exports.updateExpense = (req, res) => {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;
    
    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    Expense.update(id, title, amount, category, date, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating expense' });
        }
        res.json({ message: 'Expense updated successfully' });
    });
};


exports.searchExpensesByCategory = (req, res) => {
    const { category } = req.query;
    Expense.findByCategory(category, (err, expenses) => {
        if (err) return res.status(500).json({ error: 'Error fetching expenses' });
        res.json(expenses);
    });
};