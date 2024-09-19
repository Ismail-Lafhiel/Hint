const express = require('express');
const path = require('path');
const syncDatabase = require('./scripts/sync'); 
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

// Middleware de session
const secretkey = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secretkey, 
  resave: false,  
  saveUninitialized: true
}));

app.use(flash());

// Middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurer les routes
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const articleRoutes = require('./routes/articles');

app.use('/articles', articleRoutes);
app.use("/", indexRouter);
app.use("/register", registerRouter);

// Configuration du moteur de vue
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware pour les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isDev = app.get('env') === 'development';
  res.status(500).render('error', {
    message: 'Erreur interne du serveur',
    error: isDev ? err : {}
  });
});

app.get('/test-error', (req, res) => {
  throw new Error('Test d\'erreur');
});

// Démarrer le serveur après la synchronisation de la base de données
syncDatabase().then(() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
