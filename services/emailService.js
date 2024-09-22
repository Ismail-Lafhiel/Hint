require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRecoveryEmail = async (to, token) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Password Recovery",
    text: `Click the link to reset your password: http://localhost:3000/update-password?token=${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Recovery email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendRecoveryEmail };