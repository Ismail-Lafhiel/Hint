const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const syncDatabase = require("./scripts/sync");
const session = require("express-session");
const flash = require("connect-flash");
const { redirectIfAuthenticated } = require("./middlewares/authMiddleware");
const globalVarsMiddleware = require("./middlewares/globalVarsMiddleware");
require("dotenv").config();
const crypto = require('crypto');

const app = express();

// Middleware de session
const secretkey = crypto.randomBytes(64).toString('hex');
app.use(session({
  secret: secretkey, 
  resave: false,  
  saveUninitialized: true,
  cookie: { secure: false },
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
    message: 'Erreur interne du serveur' + res.Error,
    error: isDev ? err : {}
  });
});

app.get('/test-error', (req, res) => {
  throw new Error('Test d\'erreur');
});

// Use global variables middleware
app.use(globalVarsMiddleware);

// Sync database and start server
syncDatabase().then(() => {
  app.use("/login", redirectIfAuthenticated, require("./routes/login"));
  app.use("/passwordRecovery", redirectIfAuthenticated, require("./routes/passwordRecovery"));
  app.use("/update-password", require("./routes/passwordUpdate"));
  app.use("/logout", require("./routes/logout"));

  // Démarrer le serveur après la synchronisation de la base de données
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error('Database synchronization failed:', error);
});
