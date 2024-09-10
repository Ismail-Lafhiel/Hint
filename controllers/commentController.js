const Comment = require('../models/Comment');
const User = require('../models/User');
const Article = require('../models/Article');


exports.getCommentsByArticle = async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const comments = await Comment.findAll({
            where: { articleId: articleId },
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Article, attributes: ['title'] }
            ]
        });

        res.render('comment', { 
            title: `Comments for Article ${articleId}`,
            comments: comments,
            articleId: articleId
        });
    } catch (err) {
        console.error('Erreur de base de données :', err);
        res.status(500).send('Erreur de base de données');
    }
};
