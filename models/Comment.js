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
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hidden: {
      type:DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define relationship: a comment belongs to a user and an article
Comment.belongsTo(User, { foreignKey: "userId", as: "author", onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: "userId", onDelete: 'CASCADE' });

Comment.belongsTo(Article, { foreignKey: "articleId", onDelete: 'CASCADE' });
Article.hasMany(Comment, { foreignKey: "articleId", onDelete: 'CASCADE' });

module.exports = Comment;
