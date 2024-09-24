const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.redirectIfNotAuthenticated, EditController.upload.fields([{ name: 'banner' }, { name: 'image' }]), EditController.editProfile);
router.get('/:username', authMiddleware.redirectIfNotAuthenticated, EditController.usernameCheck);

module.exports = router;