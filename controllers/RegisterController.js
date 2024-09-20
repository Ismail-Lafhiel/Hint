const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showRegisterForm = (req, res) => {
  res.render("register", { title: "Register", errors: [], formData: {} });
};

exports.registerUser = async (req, res) => {
  const { fullname, email, password, "remember-me": rememberMe } = req.body;
  const errors = [];

  // Validate fullname (must be a combination of first name and last name)
  const namePattern = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (!fullname || !namePattern.test(fullname)) {
    errors.push("Full name must be a combination of first name and last name.");
  }

  // Validate email using regex and check if it exists in the database
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email || !emailPattern.test(email)) {
    errors.push("A valid email address is required.");
  } else {
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      errors.push("This email address is already registered.");
    }
  }

  // Validate strong password (at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
  const strongPasswordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8}$/;
  if (!password || !strongPasswordPattern.test(password)) {
    errors.push(
      "Password must be at least 8 characters long, and doesn't contain only numbers."
    );
  }

  // If validation fails, re-render the form with error messages and form data
  if (errors.length > 0) {
    return res.render("register", {
      title: "Register",
      errors,
      formData: { fullname, email, password, rememberMe },
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username automatically in the format: @fullname#443
    const baseUsername = `@${fullname.replace(" ", "").toLowerCase()}`;
    const randomSuffix = Math.floor(Math.random() * 900) + 100; // Generates a random 3-digit number
    const username = `${baseUsername}#${randomSuffix}`;

    await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    // After successful registration, redirect to the login page with a success message
    req.session.successMessage = "Registration successful. You can now log in.";
    return res.redirect("/login");
  } catch (error) {
    console.error("Error saving user to the database:", error);
    errors.push("An error occurred while saving the user. Please try again.");
    return res.render("register", {
      title: "Register",
      errors,
      formData: { fullname, email, password, rememberMe },
    });
  }
};
