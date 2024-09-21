const crypto = require("crypto");
const User = require("../models/User");
const { sendRecoveryEmail } = require("../services/emailService");

exports.showPasswordRecoveryForm = (req, res) => {
  const successMessage = req.session.successMessage || null;
  const errorMessage = req.session.errorMessage || null;

  req.session.successMessage = null;
  req.session.errorMessage = null;

  res.render("passwordRecovery", {
    title: "Recover Password",
    successMessage,
    errorMessage,
  });
};

exports.sendPasswordRecoveryEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.errorMessage = "Email not found.";
      return res.redirect("/passwordRecovery");
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000;
    await user.save();

    await sendRecoveryEmail(email, token); // Send email

    req.session.successMessage = "Recovery email sent.";
    return res.redirect("/login");
  } catch (error) {
    console.error("Error sending password recovery email:", error);
    req.session.errorMessage =
      "An error occurred while sending the recovery email.";
    return res.redirect("/passwordRecovery");
  }
};
