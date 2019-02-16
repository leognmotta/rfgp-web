const express = require('express');
const router = express.Router();

const auth = require('./v1/authRoutes');
const shopRoutes = require('./v1/shopRoutes');

router.use('/auth', auth);
router.use('/shop', shopRoutes);

module.exports = router;
