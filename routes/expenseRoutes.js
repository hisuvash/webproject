// /routes/expenseRoutes.js - Expense Routes
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const multer = require('multer');

router.get('/search', expenseController.categoryItem);
router.get('/:email', expenseController.getExpenses);
router.delete('/delete-expense/:id', expenseController.deleteExpense);

router.get('/getById/:id', expenseController.getExpense);


// Configure multer to accept file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });
router.post('/addExpense', upload.single('receipt'), expenseController.addExpense);
router.put('/update-expenses/:id', expenseController.updateExpense);
module.exports = router;


