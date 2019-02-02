const express = require('express');

const projectController = require('../controllers/projectController');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/', isAuth, projectController.default);

module.exports = router;
