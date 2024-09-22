const express = require("express");
const LoginController = require("../controllers/LoginController");
const router = express.Router();
const { redirectIfAuthenticated } = require('../middlewares/authMiddleware');

router.use(redirectIfAuthenticated);
router.get("/", LoginController.showLoginForm);
router.post("/", LoginController.loginUser);


module.exports = router;
