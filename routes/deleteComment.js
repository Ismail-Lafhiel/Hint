const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', authMiddleware.redirectIfNotAuthenticated, commentController.deleteCommentById);

module.exports = router;
