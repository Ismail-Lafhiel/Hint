const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:id/:userId', commentController.likeComment);
router.delete('/:id/:userId', commentController.likeComment);

module.exports = router;