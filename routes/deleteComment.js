const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:articleId', authMiddleware.redirectIfNotAuthenticated, commentController.getCommentsByArticle);

router.post('/:articleId', authMiddleware.redirectIfNotAuthenticated, commentController.addCommentByArticle);

module.exports = router;
