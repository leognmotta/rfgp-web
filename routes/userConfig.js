const express = require('express');

const userConfigController = require('../controllers/userConfigController');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/confirm-email/:emailToken', userConfigController.confirmEmail);

module.exports = router;
