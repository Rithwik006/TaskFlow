const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, updateUserStatus, getAnalytics } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
