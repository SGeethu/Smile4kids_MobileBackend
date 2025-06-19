// filepath: c:\Users\ADMIN\Desktop\backend_mobile\login\loginRoutes.js
const express = require('express');
const loginController = require('./loginController');
const authMiddleware = require('../authMiddleware');

const router = express.Router();

router.post('/', loginController.login); // Login only

// New: Update preferences (requires auth)
router.post('/preferences', authMiddleware, loginController.updatePreferences);

router.get('/preferences', authMiddleware, loginController.getPreferences);
router.get('/preferences/:userId', authMiddleware, loginController.getPreferencesById);

module.exports = router;

