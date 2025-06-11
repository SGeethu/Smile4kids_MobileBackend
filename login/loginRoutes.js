// filepath: c:\Users\ADMIN\Desktop\backend_mobile\login\loginRoutes.js
const express = require('express');
const loginController = require('./loginController');

const router = express.Router();

router.post('/', loginController.login);

module.exports = router;