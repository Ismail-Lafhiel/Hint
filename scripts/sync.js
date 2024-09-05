const sequelize = require("../config/database");
const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");

async function syncDatabase() {
  try {
    // Sync the models
    await sequelize.sync({ force: true }); // Drops tables and recreates them
    console.log("Database synced");
  } catch (err) {
    console.error("Sync error:", err);
  }
}

syncDatabase();