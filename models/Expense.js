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
    create: (title, amount, category, date, receipt, email, callback) => {
        db.run(`INSERT INTO expenses (title, amount, category, date, receipt, email) VALUES (?, ?, ?, ?, ?,?)`,
            [title, amount, category, date, receipt, email], callback);
    },
    getAll: (email, callback) => {
        db.all(`SELECT * FROM expenses where email = ?`,[email], callback);
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
    // findByCategory: (category, email, callback) => {
    //     db.all(`SELECT * FROM expenses WHERE category = Tools AND email = abc@test.com`, callback);
    // }
    findByCategory: (category, email, callback) => {
        console.log("🔍 Running SQL Query: SELECT * FROM expenses WHERE category = ? AND email = ?", [category, email]);
    
        db.all(`SELECT * FROM expenses WHERE category = ? AND email = ?`, [category, email], (err, rows) => {
            if (err) {
                console.error("🚨 SQL Error:", err);
                return callback(err, null);
            }
    
            console.log("✅ SQL Query Result:", rows);
            callback(null, rows);
        });
    }
    
};

module.exports = Expense;
