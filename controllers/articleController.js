const { Article, User } = require('../models');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created.');
}

// Configure multer to store images in 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

module.exports = {
  create(req, res) {
    res.render('articles/create', {
      title: 'Create a New Article',
      data: {},
      errorMessage: req.flash('errorMessage')
    });
  },

  async store(req, res) {
    try {
      const { title, content } = req.body;
      const userId = req.user && req.user.id ? req.user.id : 1;
      const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

      if (!title || !content) {
        req.flash('errorMessage', 'Title and content are required.');
        return res.redirect('/articles/create');
      }

      await Article.create({
        title,
        content,
        userId,
        coverImage
      });

      res.redirect('/articles/listes');
    } catch (error) {
      console.error('Error saving article:', error);
      req.flash('errorMessage', error.message || 'An error occurred while creating the article.');
      res.redirect('/articles/create');
    }
  },

  async getArticles(req, res) {
    try {
      const articles = await Article.findAll({
        include: {
          model: User,
          attributes: ['fullname', 'image', 'bio'] // Assurez-vous que les attributs correspondent
        }
      });
  
      articles.forEach(article => {
        article.content = sanitizeHtml(article.content, {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
          allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
        });
      });
  
      res.render('articles/listes', { title: 'Articles', articles });
    } catch (error) {
      console.error('Error retrieving articles:', error);
      res.status(500).render('error', { message: 'Server error while retrieving articles.' });
    }
  }
  
};
