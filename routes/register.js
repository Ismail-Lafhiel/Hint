const express = require("express");
const RegisterController = require("../controllers/RegisterController");
const router = express.Router();

router.get("/", RegisterController.showRegisterForm);
router.post("/", RegisterController.registerUser);

module.exports = router;
