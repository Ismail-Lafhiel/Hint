const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showLoginForm = (req, res) => {
  const successMessage = req.session.successMessage || null;

  req.session.successMessage = null;

  res.render("login", {
    title: "Login",
    errors: [],
    formData: {},
    successMessage,
  });
};
