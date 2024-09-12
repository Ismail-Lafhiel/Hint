const sequelize = require('../config/database');
const Article = require('../models/Article');

async function resetArticlesTable() {
  try {
    await sequelize.sync();

    await Article.destroy({ where: {} });

    await sequelize.query('ALTER TABLE `Articles` AUTO_INCREMENT = 1;');

    console.log('Articles table has been cleared and auto-increment reset to 1.');
  } catch (error) {
    console.error('Error resetting Articles table:', error);
  } finally {
    await sequelize.close();
  }
}

resetArticlesTable();
