const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:userId', authMiddleware.redirectIfNotAuthenticated, UserController.getProfile);
router.get('/', authMiddleware.redirectIfNotAuthenticated, UserController.getProfile);

module.exports = router;