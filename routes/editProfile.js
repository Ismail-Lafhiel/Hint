const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');

router.post('/', EditController.upload.fields([{ name: 'banner' }, { name: 'image' }]), EditController.editProfile);
router.get('/:username', EditController.usernameCheck);

module.exports = router;