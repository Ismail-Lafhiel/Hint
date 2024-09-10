const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:articleId', commentController.getCommentsByArticle);

module.exports = router;
