const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Render register form
router.get("/", (req, res) => {
  res.render("register", { title: "Register Page" });
});

// Handle form submission
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate form input
    if (!username || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("Email is already in use");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
