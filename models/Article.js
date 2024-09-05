const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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

// Define relationship: an article belongs to a user
Article.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(Article, { foreignKey: "userId" });

module.exports = Article;