// /models/Expense.js - Expense Model
const db = require('../config/database');
db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    amount REAL,
    category TEXT,
    date TEXT,
    receipt TEXT,
    email TEXT NOT NULL
)`);

const Expense = {
    create: (title, amount, category, date, receipt, callback) => {
        db.run(`INSERT INTO expenses (title, amount, category, date, receipt) VALUES (?, ?, ?, ?, ?)`,
            [title, amount, category, date, receipt], callback);
    },
    getAll: (callback) => {
        db.all(`SELECT * FROM expenses`, callback);
    },
    delete: (id, callback) => {
        db.run(`DELETE FROM expenses WHERE id = ?`, [id], callback);
    },
    update: (id, title, amount, category, date, callback) => {
        db.run(`UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?`,
            [title, amount, category, date, id], callback);
    },
    getById: (id, callback) => {
        db.get(`SELECT * FROM expenses WHERE id = ?`, [id], callback);
    },
    findByCategory: (category, callback) => {
        db.all(`SELECT * FROM expenses WHERE category = ?`, [category], callback);
    }
};

module.exports = Expense;
