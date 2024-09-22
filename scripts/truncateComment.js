const sequelize = require('../config/database');
const Comment = require('../models/Comment');

async function truncateCommentsTable() {
  try {
    await Comment.destroy({ where: {}, truncate: true });

    await sequelize.query('ALTER TABLE `Comments` AUTO_INCREMENT = 1;');

    console.log('Comments table has been truncated and AUTO_INCREMENT reset.');
  } catch (error) {
    console.error('Error truncating Comments table:', error);
  } finally {
    await sequelize.close();
  }
}

truncateCommentsTable();
