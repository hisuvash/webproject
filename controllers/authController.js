// /controllers/authController.js - Authentication Logic
const User = require('../models/User');
const nodemailer = require('nodemailer');
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'a_secret_key'; 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mrsuvash@gmail.com',  
        pass: ''  
    }
});
exports.register = (req, res) => {
    const { name, address, email, password } = req.body;
    const verificationCode = Math.random().toString(36).substr(2, 8);
    User.create(name, address, email, password, (err) => {
        if (err) {
            return res.status(400).send('User already exists');
        }else{
            console.log("Sending email")
            const mailOptions = {
                from: 'mrsuvash@gmail.com',
                to: email,
                subject: 'Account Verification',
                text: `Click the link to activate your account: http://localhost:3000/verify?code=${verificationCode}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(500).send('Email not sent');
                } else {
                    res.send('Registration successful! Check your email for verification.');
                    setTimeout(function() {
                        window.location.href = '/login.html'; 
                    }, 3000);
                }
            });
        }
        res.send('Registration successful!');
    });

   };

exports.login = (req, res) => {
    const { email, password } = req.body;
    // console.log("DId i come to server to login?")
    User.findByEmail(email, (err, user) => {
        if (err || !user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

        // Send the token to the frontend
        res.json({ message: 'Login successful', token });
     
    });
};
