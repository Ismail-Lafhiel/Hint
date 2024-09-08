const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Render the registration form
router.get("/", (req, res) => {
  res.render("register", {
    title: "Register",
    usernameError: req.query.usernameError || "",
    emailError: req.query.emailError || "",
    passwordError: req.query.passwordError || "",
    usernameSuccess: req.query.usernameSuccess || "",
    emailSuccess: req.query.emailSuccess || "",
    passwordSuccess: req.query.passwordSuccess || "",
  });
});

// Handle form submission
router.post(
  "/",
  [
    check("username")
      .notEmpty()
      .withMessage("Full Name is required")
      .isLength({ min: 6 })
      .withMessage("Full Name must be at least 6 characters long"),
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = {};
      errors.array().forEach((error) => {
        errorMessages[error.param + "Error"] = error.msg;
      });
      return res.redirect(`/register?${new URLSearchParams(errorMessages).toString()}`);
    }

    // Form data is valid, handle the registration logic here
    res.redirect(`/register?usernameSuccess=Your registration was successful!`);
  }
);

module.exports = router;
