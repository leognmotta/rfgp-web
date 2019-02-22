const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const shopRoutes = require('./shopRoutes');

router.use('/auth', authRoutes);
router.use('/shop', shopRoutes);

module.exports = router;
