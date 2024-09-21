const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const syncDatabase = require("./scripts/sync");
const session = require("express-session");
const flash = require("connect-flash");
const { redirectIfAuthenticated } = require("./middlewares/authMiddleware");
const globalVarsMiddleware = require("./middlewares/globalVarsMiddleware");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Setting up flash middleware
app.use(flash());

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Use global variables middleware
app.use(globalVarsMiddleware);

// Sync database and start server
syncDatabase().then(() => {
  const indexRouter = require("./routes/index");
  const registerRouter = require("./routes/register");
  const loginRouter = require("./routes/login");
  const passwordRecoveryRouter = require("./routes/passwordRecovery");
  const passwordUpdateRouter = require("./routes/passwordUpdate");
  const logoutRouter = require("./routes/logout");
  app.use("/", indexRouter);
  app.use("/register", redirectIfAuthenticated, registerRouter);
  app.use("/login", redirectIfAuthenticated, loginRouter);
  app.use("/passwordRecovery", redirectIfAuthenticated, passwordRecoveryRouter);
  app.use("/update-password", passwordUpdateRouter);
  app.use("/logout", logoutRouter);
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
