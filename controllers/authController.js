// /controllers/authController.js - Authentication Logic
const User = require('../models/User');

exports.register = (req, res) => {
    const { name, address, email, password } = req.body;
    User.create(name, address, email, password, (err) => {
        if (err) return res.status(400).send('User already exists');
        res.send('Registration successful!');
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
        if (err || !user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }
        res.send('Login successful');
    });
};
