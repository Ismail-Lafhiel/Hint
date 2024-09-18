const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const successMessage = req.session.successMessage || null;
    console.log(successMessage);
    
    
    delete req.session.successMessage;
    
    res.render("login", { title: "Login", successMessage });
  } catch (error) {
    console.error("Error rendering login page:", error);
    res.status(500).send("An error occurred while rendering the login page.");
  }
});

module.exports = router;
