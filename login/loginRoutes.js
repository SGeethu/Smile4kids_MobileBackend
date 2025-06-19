// filepath: c:\Users\ADMIN\Desktop\backend_mobile\login\loginRoutes.js
const express = require('express');
const loginController = require('./loginController');
const authMiddleware = require('../authMiddleware');

const router = express.Router();

router.post('/', loginController.login);
router.post('/with-preferences', loginController.loginWithPreferences);
router.get('/preferences', authMiddleware, loginController.getPreferences);
router.post('/set-preferences', authMiddleware, loginController.setPreferences);

module.exports = router;

