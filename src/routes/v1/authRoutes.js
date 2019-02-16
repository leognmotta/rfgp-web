const express = require('express');
const router = express.Router();

const isAuth = require('../../middlewares/isAuth');

const authController = require('../../controllers/authController');

const passport = require('passport');
require('../../middlewares/passport')(passport);

// /v1/auth/is-token-valid
router.get('/is-token-valid', isAuth, authController.getIsTokenValid);

// /v1/auth/validate-email/:token
router.get('/validate-email/:token', authController.putConfirmEmail);

// /v1/auth/signup
router.post('/signup', authController.postSignUp);

// /v1/auth/signin
router.post('/signin', authController.postSignIn);

module.exports = router;
