const { faker } = require('@faker-js/faker');
const sequelize = require('../config/database');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Article = require('../models/Article');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetCommentsTable() {
  try {
    await Comment.destroy({ where: {} });
    await sequelize.query('ALTER TABLE `Comments` AUTO_INCREMENT = 1;');
  } catch (error) {
    console.error('Error resetting Comments table:', error);
  }
}

async function getUserIds() {
  try {
    const users = await User.findAll({ attributes: ['id'] });
    return users.map(user => user.id);
  } catch (error) {
    console.error('Error fetching user IDs:', error);
    return [];
  }
}

async function getArticleIds() {
  try {
    const articles = await Article.findAll({ attributes: ['id'] });
    return articles.map(article => article.id);
  } catch (error) {
    console.error('Error fetching article IDs:', error);
    return [];
  }
}

async function seedSpecificComment() {
  rl.question('Enter comment content: ', async (content) => {
    const userIds = await getUserIds();
    const articleIds = await getArticleIds();
    const userId = userIds.length ? userIds[Math.floor(Math.random() * userIds.length)] : null;
    const articleId = articleIds.length ? articleIds[Math.floor(Math.random() * articleIds.length)] : null;
    try {
      await Comment.create({ content, userId, articleId });
      console.log('Specific comment has been added.');
    } catch (error) {
      console.error('Error adding specific comment:', error);
    } finally {
      rl.close();
      await sequelize.close();
    }
  });
}

async function seedRandomComments(count) {
  try {
    const userIds = await getUserIds();
    const articleIds = await getArticleIds();
    const comments = [];
    for (let i = 0; i < count; i++) {
      comments.push({
        content: faker.lorem.sentence(),
        userId: userIds.length ? userIds[Math.floor(Math.random() * userIds.length)] : null,
        articleId: articleIds.length ? articleIds[Math.floor(Math.random() * articleIds.length)] : null
      });
    }
    await Comment.bulkCreate(comments);
    console.log(`${count} random comments have been added.`);
  } catch (error) {
    console.error('Error adding random comments:', error);
  } finally {
    rl.close();
    await sequelize.close();
  }
}

async function main() {
  await resetCommentsTable();

  rl.question('Do you want to insert random comments? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      rl.question('How many random comments do you want to insert? ', async (count) => {
        const numComments = parseInt(count, 10);
        if (isNaN(numComments) || numComments <= 0) {
          console.log('Invalid number. Please enter a positive integer.');
          rl.close();
          await sequelize.close();
          return;
        }
        await seedRandomComments(numComments);
      });
    } else {
      await seedSpecificComment();
    }
  });
}

main();
