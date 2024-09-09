//  config/database.js
require("dotenv").config(); // Load .env file

const { Sequelize } = require("sequelize");

// Use environment variables for sensitive data
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to true if you want to see SQL queries in the console
  }
);

module.exports = sequelize;
