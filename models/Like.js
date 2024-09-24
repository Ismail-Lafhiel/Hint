const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Comment = require("./Comment");

const Like = sequelize.define(
  "Like",
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
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment, 
        key: 'id',
      },
      onDelete: 'CASCADE', 
    },
  },
  {
    timestamps: true, 
  }
);


Like.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });
User.hasMany(Like, { foreignKey: "userId", onDelete: 'CASCADE' });

Like.belongsTo(Comment, { foreignKey: "commentId", onDelete: 'CASCADE' });
Comment.hasMany(Like, { foreignKey: "commentId", onDelete: 'CASCADE' });

module.exports = Like;
