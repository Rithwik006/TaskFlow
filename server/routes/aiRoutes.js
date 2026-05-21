const express = require('express');
const router = express.Router();
const { chatWithAI, getChatHistory } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/chat', chatWithAI);
router.get('/history', getChatHistory);

module.exports = router;
