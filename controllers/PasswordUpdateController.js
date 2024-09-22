const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showPasswordUpdateForm = async (req, res) => {
  const token = req.query.token;

  try {
    const user = await User.findOne({ where: { resetPasswordToken: token } });

    if (!user || user.resetPasswordExpires < Date.now()) {
      req.session.errorMessage =
        "Password reset token is invalid or has expired.";
      return res.redirect("/passwordRecovery");
    }

    // Render the update password form with the token and messages
    res.render("passwordUpdate", {
      title: "Password update",
      token,
      successMessage: req.session.successMessage || null, // Pass successMessage
      errorMessage: req.session.errorMessage || null, // Pass errorMessage
    });

    // Clear messages after rendering
    req.session.successMessage = null;
    req.session.errorMessage = null;
  } catch (error) {
    console.error("Error showing update password form:", error);
    req.session.errorMessage = "An error occurred. Please try again.";
    return res.redirect("/passwordRecovery");
  }
};

exports.updatePassword = async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  if (password !== confirmPassword) {
    req.session.errorMessage = "Passwords do not match.";
    return res.redirect(`/update-password?token=${token}`);
  }

  try {
    const user = await User.findOne({ where: { resetPasswordToken: token } });

    // Log the user and token for debugging
    console.log("User found:", user);
    console.log("Current Time:", Date.now());
    console.log("Token Expiration:", user.resetPasswordExpires);

    if (!user || user.resetPasswordExpires < Date.now()) {
      req.session.errorMessage =
        "Password reset token is invalid or has expired.";
      return res.redirect("/passwordRecovery");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null; // Clear the token
    user.resetPasswordExpires = null; // Clear the expiration
    await user.save();

    req.session.successMessage = "Password has been updated.";
    return res.redirect("/login");
  } catch (error) {
    console.error("Error updating password:", error);
    req.session.errorMessage = "An error occurred while updating the password.";
    return res.redirect(`/update-password?token=${token}`);
  }
};
