const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const syncDatabase = require("./scripts/sync"); // Import sync function
const { deleteCommentById } = require("./controllers/commentController");

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
  const commentRouter = require("./routes/comment"); 
  const deleteCommentRouter = require("./routes/deleteComment");
  const likeCommentRouter = require("./routes/likeComment");
  app.use("/", indexRouter);
  app.use("/register", registerRouter);
  app.use("/comment", commentRouter);
  app.use('/delete', deleteCommentRouter);
  app.use('/like', likeCommentRouter);
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
