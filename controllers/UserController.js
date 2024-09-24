const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const ArticleLike = require('../models/ArticleLikes');
const Like = require('../models/Like');
const sanitizeHtml = require('sanitize-html');
const { logger } = require('sequelize/lib/utils/logger');

function getFirstWords(text, wordCount) {
    return text.split(' ').slice(0, wordCount).join(' ');
}

exports.getProfile = async (req, res) => {
    let userId = req.params.userId;

    if (!req.params.userId) {
        userId = req.session.user.id;
    }

    const postCount = await Article.count({ where: { userId: userId } });

    const commentCount = await Comment.count({
        include: {
            model: Article,
            where: { userId: userId }
        }
    });

    const likeCount = await ArticleLike.count({
        include: {
            model: Article,
            where: { userId: userId }
        }
    });

    const articles = await Article.findAll({ where: { userId: userId } });

    let allLikes = 0;
    let allViews = 0;

    const processedArticles = await Promise.all(articles.map(async (article) => {
        article.smallDescription = sanitizeHtml(getFirstWords(article.content, 5), {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
            allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
        });
        article.content = sanitizeHtml(article.content, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img'],
            allowedAttributes: { a: ['href'], img: ['src', 'alt'] }
        });
        allLikes += article.likes;
        allViews += article.views;
        article.isLiked = !!(await ArticleLike.findOne({ where: { articleId: article.id, userId: req.session.user.id } }));
        console.log(article.isLiked);
        return article;
    }));

    console.log(allLikes);
    console.log(allViews);
    

    try {
        const profile = await User.findOne({ where: { id: userId } });
        res.render('profile', {
            title: `${profile.fullname}'s Profile`,
            profile: profile,
            articles: processedArticles,
            postCount: postCount,
            commentCount: commentCount,
            allLikes: allLikes,
            allViews: allViews,
            likeCount: likeCount,
            session: req.session
        });
    } catch (err) {
        // Redirect to 404 page
        res.status(404).render('404', { title: 'Page not found' });
    }
};