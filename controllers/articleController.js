const { Article, User } = require('../models');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created.');
}

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
      
      const { title, content, description } = req.body;
      console.log(req.user);
      console.log(req.user.id);
      const userId = req.user && req.user.id ? req.user.id : 1;
      const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

      if (!title || !content) {
        req.flash('errorMessage', 'Title and content are required.');
        return res.redirect('/articles/create');
      }

      await Article.create({
        title,
        content,
        description,
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
          attributes: ['fullname', 'image', 'bio'] 
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
  },

  async show(req, res) {
    try {
      const articleId = req.params.id;

      const article = await Article.findOne({
        where: { id: articleId },
        include: {
          model: User,
          attributes: ['fullname', 'image', 'bio', 'createdAt'] 
        }
      });

      if (!article) {
        return res.status(404).render('error', { message: 'Article not found' });
      }

      article.content = sanitizeHtml(article.content, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
        allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
      });

      res.render('articles/details', { title: article.title, article });
    } catch (error) {
      console.error('Error retrieving article details:', error);
      res.status(500).render('error', { message: 'Server error while retrieving the article.' });
    }
  },

  async edit(req, res) {
    try {
      const articleId = req.params.id;
      const article = await Article.findByPk(articleId);
  
      if (!article) {
        return res.status(404).render('error', { message: 'Article not found' });
      }
  
     
  
      res.render('articles/edit', { title: 'Edit Article', article });
    } catch (error) {
      console.error('Error retrieving article for editing:', error);
      res.status(500).render('error', { message: 'Server error while retrieving the article for editing.' });
    }
  },
  
  

  async update(req, res) {
    try {
      const articleId = req.params.id;
      const article = await Article.findByPk(articleId);

      if (!article) {
        return res.status(404).send('Article not found');
      }

      

      const { title, content, description } = req.body;
      const coverImage = req.file ? `/uploads/${req.file.filename}` : article.coverImage;

      article.title = title;
      article.content = content;
      article.description = description;
      article.coverImage = coverImage;
      await article.save();

      res.redirect(`/articles/${article.id}`);
    } catch (error) {
      console.error('Error updating article:', error);
      req.flash('errorMessage', error.message || 'An error occurred while updating the article.');
      res.redirect(`/articles/${req.params.id}/edit`);
    }
  },

  async delete(req, res) {
    try {
      const articleId = req.params.id;
      const article = await Article.findByPk(articleId);

      if (!article) {
        return res.status(404).send('Article not found');
      }

      

      await article.destroy();
      res.redirect('/articles/listes'); 
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).send('Server error while deleting the article.');
    }
  }
};
