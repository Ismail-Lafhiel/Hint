const sequelize = require('../config/database');
const User = require('../models/User');

async function resetUsersTable() {
  try {
    // Synchronize models and database
    await sequelize.sync();

    // Drop all rows from the Users table
    await User.destroy({ where: {} });

    // Reset the auto-increment value to 1
    await sequelize.query('ALTER TABLE `Users` AUTO_INCREMENT = 1;');

    console.log('Users table has been cleared and auto-increment reset to 1.');
  } catch (error) {
    console.error('Error resetting Users table:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Execute the function
resetUsersTable();
