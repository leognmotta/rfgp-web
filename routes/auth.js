const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);

router.post('/authenticate', authController.authenticate);

router.post('/send-reset-password', authController.sendResetPassword);

router.post(
  '/reset-password/:passwordResetToken',
  authController.resetPassword
);

module.exports = router;
