const axios = require('axios');

// @desc    Chat with AI Interviewer
// @route   POST /api/interview/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    // Call Python Service
    // In a real app, we might also save the chat logs to MongoDB here
    const pythonResponse = await axios.post('http://localhost:8000/interview', {
      message,
      history
    });

    res.json(pythonResponse.data);

  } catch (error) {
    console.error("AI Chat Error:", error.message);
    res.status(503).json({ message: 'AI Service unavailable' });
  }
};

module.exports = { chatWithAI };