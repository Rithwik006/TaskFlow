const axios = require('axios');
const Chat = require('../models/Chat');
const Task = require('../models/Task');

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // Get user's tasks for context
    const tasks = await Task.find({ assignedTo: userId });
    const taskContext = tasks.map(t => `${t.title} (${t.status}, due: ${t.dueDate})`).join(', ');

    // Get chat history
    const history = await Chat.find({ user: userId }).sort({ timestamp: 1 }).limit(10);
    const historyContext = history.map(h => `${h.role}: ${h.content}`).join('\n');

    const prompt = `
      You are a productivity assistant for a Task Management App.
      User's tasks: ${taskContext}
      Recent history:
      ${historyContext}
      
      User says: ${message}
      
      Provide a helpful, concise, and motivational response. Suggest priorities or organization tips based on their tasks.
    `;

    // Call Gemini API (Assuming GOOGLE_API_KEY is set)
    // Using simple axios call to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const aiMessage = response.data.candidates[0].content.parts[0].text;

    // Save history
    await Chat.create({ user: userId, role: 'user', content: message });
    await Chat.create({ user: userId, role: 'assistant', content: aiMessage });

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI Assistant is currently unavailable.' });
  }
};

exports.getChatHistory = async (req, res) => {
    try {
        const history = await Chat.find({ user: req.user._id }).sort({ timestamp: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
