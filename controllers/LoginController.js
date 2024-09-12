const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showLoginForm = (req, res) => {
    res.render("login", { title: "Login", errors: [], formData: {} });
  };