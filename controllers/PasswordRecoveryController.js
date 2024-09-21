const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
      req.session.errorMessage = "No account with that email address exists.";
      return res.redirect("/passwordRecovery");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://${req.headers.host}/update-password?token=${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    req.session.successMessage =
      "Password reset email has been sent. Please check your email.";
    return res.redirect("/passwordRecovery");
  } catch (error) {
    console.error("Error in sending recovery email:", error);
    req.session.errorMessage =
      "An error occurred while sending the password recovery email.";
    return res.redirect("/passwordRecovery");
  }
};
