const express = require("express");
const RegisterController = require("../controllers/RegisterController");
const router = express.Router();
const { redirectIfAuthenticated } = require('../middlewares/authMiddleware');

router.use(redirectIfAuthenticated);
router.get("/", RegisterController.showRegisterForm);
router.post("/", RegisterController.registerUser);

module.exports = router;
