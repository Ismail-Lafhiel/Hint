const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register", { title: "Register", errors: [], formData: {} });
});

router.post("/", async (req, res) => {
  const { username, email, password, "remember-me": rememberMe } = req.body;
  const errors = [];

  // Validate username (must be a combination of first name and last name)
  const namePattern = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (!username || !namePattern.test(username)) {
    errors.push("Username must be a combination of first name and last name.");
  }

  // Validate email using regex and check if it exists in the database
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email || !emailPattern.test(email)) {
    errors.push("A valid email address is required.");
  } else {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      errors.push("This email address is already registered.");
    }
  }

  // Validate strong password (at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
  const strongPasswordPattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || !strongPasswordPattern.test(password)) {
    errors.push(
      "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character."
    );
  }

  // If validation fails, re-render the form with error messages and form data
  if (errors.length > 0) {
    return res.render("register", {
      title: "Register",
      errors,
      formData: { username, email, password, rememberMe },
    });
  }

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

    // Create and save the new user in the database
    await User.create({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });

    // After successful registration, redirect to a success page or login page
    res.send("Registration successful. You can now log in.");
  } catch (error) {
    console.error("Error saving user to the database:", error);
    errors.push("An error occurred while saving the user. Please try again.");
    return res.render("register", {
      title: "Register",
      errors,
      formData: { username, email, password, rememberMe },
    });
  }
});

module.exports = router;
