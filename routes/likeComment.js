const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', authMiddleware.redirectIfNotAuthenticated, commentController.likeComment);
router.delete('/:id', authMiddleware.redirectIfNotAuthenticated, commentController.likeComment);

module.exports = router;