const express = require('express');
const forgotController = require('./forgotController');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

router.post('/send-otp', forgotController.sendOTP);
router.post('/verify-otp', forgotController.verifyOTP);
router.post('/reset-password', forgotController.resetPassword);

// Protect change-password route
router.post('/change-password', authMiddleware, forgotController.changePassword.bind(forgotController));

module.exports = router;