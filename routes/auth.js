const express = require('express');

const authController = require('../controllers/authController');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/authenticate', authController.authenticate);

router.post('/send-reset-password', authController.sendResetPassword);

router.post(
  '/reset-password/:passwordResetToken',
  authController.resetPassword
);

router.get('/is-valid-token', isAuth, authController.isValidToken);

module.exports = router;
