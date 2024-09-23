const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const sanitizeHtml = require('sanitize-html');

function getFirstWords(text, wordCount) {
    return text.split(' ').slice(0, wordCount).join(' ');
}

exports.getProfile = async (req, res) => {

    const userId = req.params.userId;

    const postCount = await Article.count(
        { where: { userId: userId } }
    );

    const commentCount = await Comment.count({
        include: {
            model: Article,
            where: { userId: userId }
        }
    });

    const likeCount = await Like.count({
        include: {
            model: Comment,
            include: {
                model: Article,
                where: { userId: userId }
            }
        }
    });

    const articles = await Article.findAll({
        where : {
            userId: userId
        }
      });

      articles.forEach(article => {
        article.smallDescription = sanitizeHtml(getFirstWords(article.content, 5), {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
            allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
          });
        article.content = sanitizeHtml(article.content, {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
          allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
        });
      });

    try {
        const profile = await User.findOne({
            where: { id: userId },
        });
        res.render('profile', { 
            title: `${profile.fullname}'s Profile`,
            profile: profile,
            articles: articles,
            postCount: postCount,
            commentCount: commentCount,
            likeCount: likeCount,
            session: req.session
        });
    } catch (err) {
        //redirect to 404 page
        res.status(404).render('404', { title: 'Page not found' });
    }
};
