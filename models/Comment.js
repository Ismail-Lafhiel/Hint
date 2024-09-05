const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Article = require("./Article");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define relationship: a comment belongs to a user and an article
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(Comment, { foreignKey: "userId" });

Comment.belongsTo(Article, { foreignKey: "articleId" });
Article.hasMany(Comment, { foreignKey: "articleId" });

module.exports = Comment;