const express = require('express');

const shopController = require('../controllers/shopController');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/produtos/:title', isAuth, shopController.getProductsByTitle);

router.get('/produto/:codebar', isAuth, shopController.getProductsByCodebar);

module.exports = router;
