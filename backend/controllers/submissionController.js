// backend/controllers/submissionController.js
const Submission = require('../models/submissionModel');
const Problem = require('../models/problemModel'); 
const axios = require('axios');

// @desc    Submit code for evaluation (Saves to DB)
// @route   POST /api/submissions
// @access  Private
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // 1. Fetch the Problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // 2. Call Python Service (Mode: submit)
    let executionResult;
    try {
      const pythonResponse = await axios.post('http://localhost:8000/execute', {
        code: code,
        test_cases: problem.testCases, // Send ALL cases (hidden & visible)
        mode: 'submit' 
      });
      executionResult = pythonResponse.data;
      
    } catch (pyError) {
      console.error("Python Service Error:", pyError.message);
      executionResult = { 
        passed: false,
        results: 'Error: AI Service unreachable. Please ensure the Python server is running.' 
      };
    }

    // 3. Create Submission Record
    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      code,
      language,
      status: executionResult.passed ? 'Accepted' : 'Wrong Answer',
    });

    // 4. Respond
    res.status(201).json({
      ...submission._doc,
      output: executionResult.results 
    });

  } catch (error) {
    res.status(400).json({ message: 'Submission failed', error: error.message });
  }
};

// @desc    Run code against sample test cases (No DB Save)
// @route   POST /api/submissions/run
// @access  Private
const runCode = async (req, res) => {
  try {
    const { problemId, code } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Filter: Only send visible test cases for "Run"
    const visibleTests = problem.testCases.filter(tc => !tc.isHidden);

    try {
      const pythonResponse = await axios.post('http://localhost:8000/execute', {
        code: code,
        test_cases: visibleTests,
        mode: 'run' // Tell Python this is a dry run
      });
      
      res.json(pythonResponse.data);

    } catch (pyError) {
      console.error("Python Service Error:", pyError.message);
      res.status(500).json({ message: 'Execution Engine Failed' });
    }

  } catch (error) {
    res.status(400).json({ message: 'Run failed', error: error.message });
  }
};

// @desc    Get user's history
// @route   GET /api/submissions/my
// @access  Private
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 });
      
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { submitCode, runCode, getMySubmissions };