const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for initiating password reset
router.post('/forgot-password', userController.forgotPassword);

// Route for handling password reset link
router.get('/reset-password/:token', userController.resetPasswordLink);

// Route for updating password
router.post('/resetpassword', userController.resetPassword);

router.post('/check', userController.checkUserExistence);

router.post('/signup', userController.signup);

module.exports = router;