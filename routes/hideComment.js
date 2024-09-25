const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/:id',authMiddleware.redirectIfNotAuthenticated,  commentController.hideComment);
module.exports = router;