const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/listes', articleController.getArticles);
router.get('/create', articleController.create);
router.post('/create', upload.single('coverImage'), articleController.store);
router.get('/:id', articleController.show);
router.post('/:id/delete', articleController.delete);
router.get('/:id/edit', articleController.edit); 
router.post('/:id/update', upload.single('coverImage'), articleController.update); 

module.exports = router;
