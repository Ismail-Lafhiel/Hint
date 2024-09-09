const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('comment', { title: 'Comment Page' });
});

module.exports = router;
