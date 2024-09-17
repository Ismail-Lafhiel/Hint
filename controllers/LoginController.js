const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showLoginForm = (req, res) => {
  const successMessage = req.session.successMessage || null;
  const errorMessage = req.session.errorMessage || null;

  req.session.successMessage = null;
  req.session.errorMessage = null;

  res.render("login", {
    title: "Login",
    errors: [],
    formData: {},
    successMessage,
    errorMessage,
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  // Validate email format
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email || !emailPattern.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  // Check if the password is provided
  if (!password) {
    errors.push("Password is required.");
  }

  // If validation fails, return errors
  if (errors.length > 0) {
    req.session.errorMessage = errors.join(" ");
    return res.redirect("/login");
  }

  try {
    // Check if a user with the provided email exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.errorMessage = "Invalid Credentials";
      return res.redirect("/login");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.errorMessage = "Invalid Credentials";
      return res.redirect("/login");
    }

    // On successful login, set session user and redirect to home page
    req.session.user = user;
    req.session.successMessage = "Login successful!";
    return res.redirect("/");
  } catch (error) {
    console.error("Error logging in:", error);
    req.session.errorMessage =
      "An error occurred while trying to log in. Please try again.";
    return res.redirect("/login");
  }
};