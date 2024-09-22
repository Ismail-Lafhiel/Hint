const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const multer = require('multer');
const path = require('path');

// Configurer multer pour stocker les images dans un dossier 'uploads'
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

// Route pour afficher la liste des articles
router.get('/listes', articleController.getArticles);

// Route pour afficher le formulaire de création d'article
router.get('/create', articleController.create);

// Route pour enregistrer un nouvel article avec une image
router.post('/create', upload.single('coverImage'), articleController.store);


  

module.exports = router;
