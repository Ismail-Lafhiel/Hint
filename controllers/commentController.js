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


exports.deleteCommentById = async (req, res) => {
    const { id }  = req.params;  

    try {
        const result = await Comment.destroy({
            where: { id: id }
        });

        if (result) {
            res.status(200).send("Comment deleted successfully");
        } else {
            res.status(404).send("Comment not found");
        }
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).send("Error deleting comment");
    }
};






