const sequelize = require('../config/database');
const Comment = require('../models/Comment');

async function truncateCommentsTable() {
  try {
    // Supprimer tous les commentaires
    await Comment.destroy({ where: {}, truncate: true });

    // Réinitialiser l'auto-incrément à 1
    await sequelize.query('ALTER TABLE `Comments` AUTO_INCREMENT = 1;');

    console.log('Comments table has been truncated and AUTO_INCREMENT reset.');
  } catch (error) {
    console.error('Error truncating Comments table:', error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
  }
}

// Exécuter la fonction
truncateCommentsTable();
