// backend/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submitCode, getMySubmissions, runCode } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitCode);       // Submit (Save to DB)
router.post('/run', protect, runCode);       // Run (Dry Run) <--- NEW
router.get('/my', protect, getMySubmissions);

module.exports = router;