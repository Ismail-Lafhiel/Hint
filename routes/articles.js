const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

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

router.get('/listes', authMiddleware.redirectIfNotAuthenticated, articleController.getArticles);
router.get('/create', authMiddleware.redirectIfNotAuthenticated, articleController.create);
router.post('/create', authMiddleware.redirectIfNotAuthenticated, upload.single('coverImage'), articleController.store);
router.get('/:id', authMiddleware.redirectIfNotAuthenticated, articleController.show);
router.post('/:id/delete', authMiddleware.redirectIfNotAuthenticated, articleController.delete);
router.get('/:id/edit', authMiddleware.redirectIfNotAuthenticated, articleController.edit); 
router.post('/:id/update', authMiddleware.redirectIfNotAuthenticated, upload.single('coverImage'), articleController.update);
router.get('/:id/like', authMiddleware.redirectIfNotAuthenticated, articleController.likeArticle);

module.exports = router;
