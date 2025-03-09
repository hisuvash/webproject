const db = require('../config/database');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

const User = {
    create: (name, address, email, password, callback) => {
        db.run(`INSERT INTO users (name, address, email, password) VALUES (?, ?, ?, ?)`,
            [name, address, email, password], callback);
    },
    findByEmail: (email, callback) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
    }
};

module.exports = User;