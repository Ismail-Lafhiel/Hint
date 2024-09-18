const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const syncDatabase = require("./scripts/sync"); // Import sync function
const e = require("express");

const app = express();

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Sync database and start server
syncDatabase().then(() => {
  const indexRouter = require("./routes/index");
  const registerRouter = require("./routes/register");
  const profileRouter = require("./routes/profile");
  const editRouter = require("./routes/edit");
  app.use("/", indexRouter);
  app.use("/register", registerRouter);
  app.use("/profile", profileRouter);
  app.use("/edit", editRouter);
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
