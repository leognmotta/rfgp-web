const express = require('express');
const router = express.Router();

const isAuth = require('../../middlewares/isAuth');

const shopController = require('../../controllers/shopController');

const passport = require('passport');
require('../../middlewares/passport')(passport);

// /v1/shop/product/:codebar
router.get('/product/:codebar', isAuth, shopController.getProductsByCodebar);

// /v1/shop/products/:title
router.get('/products/:title', isAuth, shopController.getProductsByTitle);

module.exports = router;
