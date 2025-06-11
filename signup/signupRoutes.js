const express = require('express');
const SignupController = require('./signupController');

const router = express.Router();
const signupController = new SignupController();

router.post('/', signupController.createUser); 
router.post('/update-profile', signupController.updateProfile);
router.get('/profile', signupController.getProfile);

module.exports = router;