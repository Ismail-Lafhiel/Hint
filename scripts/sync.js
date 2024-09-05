const sequelize = require("../config/database");
// const User = require('../models/User'); // Import your models here

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // Drop and recreate tables
    console.log("Database synchronized");
  } catch (err) {
    console.error("Sync error:", err);
  }
}

syncDatabase();
