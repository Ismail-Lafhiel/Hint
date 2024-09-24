const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Article = require("./Article");

const ArticleLikes = sequelize.define(
  "ArticleLikes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, 
        key: 'id',
      },
      onDelete: 'CASCADE', 
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Article, 
        key: 'id',
      },
      onDelete: 'CASCADE', 
    },
  },
  {
    timestamps: true, 
  }
);


ArticleLikes.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });
User.hasMany(ArticleLikes, { foreignKey: "userId", onDelete: 'CASCADE' });

ArticleLikes.belongsTo(Article, { foreignKey: "articleId", onDelete: 'CASCADE' });
Article.hasMany(ArticleLikes, { foreignKey: "articleId", onDelete: 'CASCADE' });

module.exports = ArticleLikes;
