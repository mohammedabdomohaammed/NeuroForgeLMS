const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithAI);

module.exports = router;