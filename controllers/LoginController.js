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
    return res.render("login", {
      title: "Login",
      errors,
      formData: { email, password },
    });
  }

  try {
    // Check if a user with the provided email exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      errors.push("No account found with this email address.");
      return res.render("login", {
        title: "Login",
        errors,
        formData: { email, password },
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.push("Incorrect password.");
      return res.render("login", {
        title: "Login",
        errors,
        formData: { email, password },
      });
    }

    // On successful login, redirect to a dashboard or home page
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    console.error("Error logging in:", error);
    errors.push("An error occurred while trying to log in. Please try again.");
    return res.render("login", {
      title: "Login",
      errors,
      formData: { email, password },
    });
  }
};
