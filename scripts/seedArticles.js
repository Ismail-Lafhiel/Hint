const { faker } = require('@faker-js/faker');
const sequelize = require('../config/database');
const Article = require('../models/Article');
const User = require('../models/User');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetArticlesTable() {
  try {
    await Article.destroy({ where: {} });
    await sequelize.query('ALTER TABLE `Articles` AUTO_INCREMENT = 1;');
  } catch (error) {
    console.error('Error resetting Articles table:', error);
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

async function seedSpecificArticle() {
  rl.question('Enter article title: ', async (title) => {
    rl.question('Enter article content: ', async (content) => {
      const userIds = await getUserIds();
      const userId = userIds.length ? userIds[Math.floor(Math.random() * userIds.length)] : null;
      try {
        await Article.create({ title, content, userId });
        console.log('Specific article has been added.');
      } catch (error) {
        console.error('Error adding specific article:', error);
      } finally {
        rl.close();
        await sequelize.close();
      }
    });
  });
}

async function seedRandomArticles(count) {
  try {
    const userIds = await getUserIds();
    const articles = [];
    for (let i = 0; i < count; i++) {
      articles.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        userId: userIds.length ? userIds[Math.floor(Math.random() * userIds.length)] : null,
        coverImage : "/images/backgroundform.webp"
      });
    }
    await Article.bulkCreate(articles);
    console.log(`${count} random articles have been added.`);
  } catch (error) {
    console.error('Error adding random articles:', error);
  } finally {
    rl.close();
    await sequelize.close();
  }
}

async function main() {
  await resetArticlesTable();

  rl.question('Do you want to insert random articles? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      rl.question('How many random articles do you want to insert? ', async (count) => {
        const numArticles = parseInt(count, 10);
        if (isNaN(numArticles) || numArticles <= 0) {
          console.log('Invalid number. Please enter a positive integer.');
          rl.close();
          await sequelize.close();
          return;
        }
        await seedRandomArticles(numArticles);
      });
    } else {
      await seedSpecificArticle();
    }
  });
}

main();
