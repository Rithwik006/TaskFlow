const express = require('express');
const router = express.Router();
const { syncUser, getCurrentUser, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/sync', syncUser);
router.get('/me', verifyToken, getCurrentUser);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
