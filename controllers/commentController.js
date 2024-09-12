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

exports.addCommentByArticle = async (req, res) => {
    const articleId = req.params.articleId;
    const { content, userId } = req.body;

    console.log("Article ID:", articleId);
    console.log("Content:", content);

    try {
        await Comment.create({
            content: content,
            articleId: articleId,
            userId: userId,
        });
        res.redirect(`/comment/${articleId}`);
    } catch (err) {
        console.error("Erreur lors de l'ajout du commentaire :", err);
        res.status(500).send("Erreur lors de l'ajout du commentaire");
    }
};

