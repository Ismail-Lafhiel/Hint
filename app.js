const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const sequelize = require('./models');
 // Sequelize instance

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files like CSS
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Sync database
// sequelize.sync()
//   .then(() => console.log('Database synced'))
//   .catch(err => console.error('Sync error:', err));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
