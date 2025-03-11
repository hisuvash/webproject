const dbExpense = require('../config/database');

dbExpense.run(`CREATE TABLE IF NOT EXISTS Monthly_Budget_Limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    month TEXT NOT NULL,
    notes TEXT
)`);

const ExpenseLimit = {
    create: (category, amount, month, notes, callback) => {
        if (!category || !amount || !month) {
            return callback(new Error('Missing required fields'), null);
        }
        dbExpense.run(`INSERT INTO Monthly_Budget_Limits (category, amount, month, notes) VALUES (?, ?, ?, ?)`,
            [category, amount, month, notes], callback);
    },
    findAll: (callback) => {
        dbExpense.all(`SELECT * FROM Monthly_Budget_Limits`, [], callback);
    }
};

module.exports = ExpenseLimit;
