// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/userController');

// Route for Registration (POST /api/users)
router.post('/', registerUser);

// Route for Login (POST /api/users/login)
router.post('/login', authUser);

// Route for Forgot Password (POST /api/users/forgot-password)
router.post('/forgot-password', forgotPassword);

// Route for Reset Password (POST /api/users/reset-password)
router.post('/reset-password', resetPassword);

module.exports = router;