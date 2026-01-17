// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/userController');

// Route for Registration (POST /api/users)
router.post('/', registerUser);

// Route for Login (POST /api/users/login)
router.post('/login', authUser);

module.exports = router;