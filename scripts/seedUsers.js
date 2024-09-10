const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const readline = require('readline');
const User = require('../models/User');
const sequelize = require('../config/database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createUser(username, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    console.log(`User ${username} created successfully`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function createRandomUsers(count) {
  try {
    const users = [];
    for (let i = 0; i < count; i++) {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ username, email, password: hashedPassword });
    }
    await User.bulkCreate(users);
    console.log(`${count} random users created successfully`);
  } catch (error) {
    console.error('Error creating random users:', error);
  }
}

function promptUser() {
  rl.question('Do you want to insert random users? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      rl.question('How many random users do you want to create? ', async (count) => {
        const num = parseInt(count);
        if (!isNaN(num) && num > 0) {
          await createRandomUsers(num);
        } else {
          console.log('Invalid number of users.');
        }
        rl.close();
      });
    } else if (answer.toLowerCase() === 'no') {
      rl.question('Enter username: ', async (username) => {
        rl.question('Enter email: ', async (email) => {
          rl.question('Enter password: ', async (password) => {
            await createUser(username, email, password);
            rl.close();
          });
        });
      });
    } else {
      console.log('Invalid action. Please use "yes" or "no".');
      rl.close();
    }
  });
}

promptUser();
