const Comment = require("../models/Comment");
const User = require("../models/User");
const Article = require("../models/Article");
const Like = require("../models/Like");

exports.getCommentsByArticle = async (req, res) => {
  const articleId = req.params.articleId;

  try {
    const comments = await Comment.findAll({
      where: { articleId: articleId },
      include: [
        { model: User, as: "author", attributes: ["username"] },
        { model: Article, attributes: ["title"] },
      ],
    });

    res.render("comment", {
      title: `Comments for Article ${articleId}`,
      comments: comments,
      articleId: articleId,
    });
  } catch (err) {
    console.error("Erreur de base de données :", err);
    res.status(500).send("Erreur de base de données");
  }
};

exports.addCommentByArticle = async (req, res) => {
  const articleId = req.body.articleId;
  const content = req.body.content;

  console.log("Article ID:", articleId);
  console.log("Content:", content);

  try {
    await Comment.create({
      content: content,
      articleId: articleId,
      userId: req.session.user.id,
    });
    res.redirect(`/articles/${articleId}#comments`);
  } catch (err) {
    console.error("Erreur lors de l'ajout du commentaire :", err);
    res.status(500).send("Erreur lors de l'ajout du commentaire");
  }
};

exports.deleteCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Comment.destroy({
      where: { id: id },
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

exports.likeComment = async (req, res) => {
  const id = req.params.id;

  try {
    const existingLike = await Like.findOne({
      where: {
        commentId: id,
        userId: req.session.user.id,
      },
    });

    if (existingLike) {
      await Like.destroy({
        where: {
          commentId: id,
          userId: req.session.user.id,
        },
      });

      const comment = await Comment.findByPk(id);
      if (comment) {
        comment.likes -= 1;
        await comment.save();
        console.log('unliked');
        return res.json({ status: 'unliked' });
      }
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    } else {
      await Like.create({
        commentId: id,
        userId: req.session.user.id,
      });

      const comment = await Comment.findByPk(id);
      if (comment) {
        comment.likes += 1;
        await comment.save();
        console.log('liked');
        return res.json({ status: 'liked' });
      }
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ success: false, message: "Error toggling like" });
  }
};

exports.getComments = async (req, res) => {
  const articleId = req.params.articleId;
  const userId = req.params.userId; 

  try {
    const comments = await Comment.findAll({
      where: { articleId },
      include: [
        {
          model: Like,
          where: { userId: userId }, 
          required: false,
        },
        {
          model: User,
          as: "author",
        },
      ],
    });

    res.render("comments", {
      comments: comments.map((comment) => ({
        ...comment.toJSON(),
        userLiked: !!comment.Likes.length,
      })),
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).send("Server Error");
  }
};
