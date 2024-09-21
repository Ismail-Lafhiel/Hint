const bcrypt = require("bcrypt");

exports.showPasswordRecoveryForm = (req, res) => {
  res.render("passwordRecovery", {
    title: "Recover Password",
  });
};