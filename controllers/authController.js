// /controllers/authController.js - Authentication Logic
const User = require('../models/User');
const nodemailer = require('nodemailer');
const db = require('../config/database');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mrsuvash@gmail.com',  // Replace with your email
        pass: 'vqbz awkg cljs acgf'  // Replace with your email password
    }
});
exports.register = (req, res) => {
    const { name, address, email, password } = req.body;
    const verificationCode = Math.random().toString(36).substr(2, 8);

    console.log("Did i come here to register")
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
                }
            });
        }
        res.send('Registration successful!');
    });

    // const { name, address, email, password } = req.body;
    // const verificationCode = Math.random().toString(36).substr(2, 8);
    // db.run('INSERT INTO users (name, address, email, password, verification_code) VALUES (?, ?, ?, ?, ?)',
    //     [name, address, email, password, verificationCode],
    //     function (err) {
    //         if (err) {
    //             res.status(400).send('User already exists');
    //         } else {
    //             console.log("Sending email")
    //             const mailOptions = {
    //                 from: 'mrsuvash@gmail.com',
    //                 to: email,
    //                 subject: 'Account Verification',
    //                 text: `Click the link to activate your account: http://localhost:3000/verify?code=${verificationCode}`
    //             };
    //             transporter.sendMail(mailOptions, (error, info) => {
    //                 if (error) {
    //                     res.status(500).send('Email not sent');
    //                 } else {
    //                     res.send('Registration successful! Check your email for verification.');
    //                 }
    //             });
    //         }
    //     });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    console.log("DId i come to server to login?")
    User.findByEmail(email, (err, user) => {
        if (err || !user || user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }
        res.send('Login successful');
    });
};
