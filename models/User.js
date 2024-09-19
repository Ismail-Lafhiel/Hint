const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "/images/backgroundform.webp",
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "/images/backgroundform.webp",
  },
  bio: {
    type: DataTypes.STRING,
  },
  color1: {
    type: DataTypes.STRING,
    defaultValue: '#480BA2',
  },
  color2: {
    type: DataTypes.STRING,
    defaultValue: '#7F35EB',
  },
  color3: {
    type: DataTypes.STRING,
    defaultValue: '#A76AFF',
  }
}, { 
  timestamps: true,
});

module.exports = User;
