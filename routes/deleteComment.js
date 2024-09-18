const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.delete('/:id', commentController.deleteCommentById);

module.exports = router;