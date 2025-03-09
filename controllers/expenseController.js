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
    console.log(req.body.title)
    console.log("I am in add expense1")
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
    ids=6
    Expense.getById(ids, (err, expense) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!expense || Object.keys(expense).length === 0) {
            console.warn("Expense not found for ID:", id);
            return res.status(404).json({ error: 'Expense not found' });
        }

        console.log("Expense retrieved:", expense);
        res.json(expense);
    });
};



// exports.getExpense = async (req, res) => {
//     console.log("I came to give single expense");

//     try {
//         const { id } = req.params;
//         const numericId = parseInt(id, 10);
//         ids=6
//         const expense = await new Promise((resolve, reject) => {
//             db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row) => {
//                 if (err) reject(err);
//                 resolve(row);
//             });
//         });

//         console.log("Raw expense data:", expense);

//         if (!expense) {
//             console.warn("Expense not found for ID:", id);
//             return res.status(404).json({ error: 'Expense not found' });
//         }

//         res.json(expense);
//     } catch (error) {
//         console.error("Database error:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // 
