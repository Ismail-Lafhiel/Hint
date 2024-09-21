const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.showPasswordUpdateForm = async (req, res) => {
  const { token } = req.query;
  
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Token not expired
      },
    });

    if (!user) {
      req.session.errorMessage = "Password reset token is invalid or has expired.";
      return res.redirect("/passwordRecovery");
    }

    // Render the password update form
    res.render("passwordUpdate", {
      title: "Update Password",
      successMessage: req.session.successMessage || null,
      errorMessage: req.session.errorMessage || null,
      token,
    });
  } catch (error) {
    console.error("Error displaying password update form:", error);
    req.session.errorMessage = "An error occurred. Please try again.";
    return res.redirect("/passwordRecovery");
  }
};

exports.updatePassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.session.errorMessage = "Passwords do not match.";
    return res.redirect(`/update-password?token=${token}`);
  }

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      },
    });

    if (!user) {
      req.session.errorMessage = "Password reset token is invalid or has expired.";
      return res.redirect("/passwordRecovery");
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    req.session.successMessage = "Your password has been updated successfully.";
    return res.redirect("/login");
  } catch (error) {
    console.error("Error updating password:", error);
    req.session.errorMessage = "An error occurred while updating your password.";
    return res.redirect(`/update-password?token=${token}`);
  }
};
