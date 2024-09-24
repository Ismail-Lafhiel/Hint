const User = require('./User');
const Article = require('./Article');

// Define associations here
User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Article };
