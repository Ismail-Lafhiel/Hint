const { Article, User } = require('../models');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const ArticleLike = require('../models/ArticleLikes');
const sanitizeHtml = require('sanitize-html');
const express = require('express');
const ArticleLikes = require('../models/ArticleLikes');
const { Op } = require('sequelize');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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
      const userId = req.session.user.id;
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

      res.redirect('/profile/' + req.session.user.id);
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
            },
            order: [['createdAt', 'DESC']]
        });

        const userId = req.session.user.id;

        const processedArticles = await Promise.all(articles.map(async (article) => {
            const liked = await ArticleLikes.findOne({ where: { articleId: article.id, userId } });
            const commentCount = await Comment.count({ where: { articleId: article.id } });
            article.liked = !!liked;
            article.commentCount = commentCount;
            article.content = sanitizeHtml(article.content, {
                allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
                allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
            });
            return article;
        }));

        res.render('articles/listes', { title: 'Articles', articles: processedArticles });
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
                attributes: ['id', 'fullname', 'username', 'banner', 'image', 'bio', 'createdAt']
            }
        });

        const articleIsLiked = await ArticleLike.findOne({ where: { articleId: articleId, userId: req.session.user.id } });

        const onlyArticle = await Article.findOne({ where: { id: articleId } });
        if (onlyArticle) {
          await onlyArticle.increment('views', { by: 1 });
        }

        if (!article) {
            return res.status(404).render('error', { message: 'Article not found' });
        }

        const comments = await Comment.findAll({
            where: { articleId },
            include: {
                model: User,
                as: 'author',
                attributes: ['fullname', 'username', 'image', 'id']
            },
            order: [['createdAt', 'DESC']]
        });

        const userId = req.session.user ? req.session.user.id : null;

        const processedComments = await Promise.all(comments.map(async (comment) => {
            const isLiked = userId ? await Like.findOne({ where: { commentId: comment.id, userId } }) : null;
            comment.isLiked = !!isLiked;
            return comment;
        }));

        article.content = sanitizeHtml(article.content, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
            allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
        });
        article.comments = processedComments;
        article.isLiked = !!articleIsLiked;
        article.views = article.views + 1;

        const sameAuthorArticles = await Article.findAll({
            where: { userId: article.userId, id: { [Op.ne]: article.id } },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.render('articles/details', { title: article.title, article, sameAuthorArticles });
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
      res.redirect('/profile/' + req.session.user.id); 
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).send('Server error while deleting the article.');
    }
  },

  async likeArticle(req, res) {
    const articleId = req.params.id;
    const userId = req.session.user.id;

    try {

        const existingLike = await ArticleLike.findOne({
            where: { articleId, userId }
        });

        if (existingLike) {

            await existingLike.destroy();

            await Article.increment('likes', { by: -1, where: { id: articleId } });

            return res.json({ status: 'unliked' });
        } else {

            await ArticleLike.create({ articleId, userId });

            await Article.increment('likes', { by: 1, where: { id: articleId } });

            return res.json({ status: 'liked' });
        }
    } catch (error) {
        console.error('Error liking article:', error);
        return res.status(500).json({ error: 'An error occurred while liking the article.' });
    }
  },
};
