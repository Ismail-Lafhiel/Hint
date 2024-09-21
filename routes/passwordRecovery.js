const express = require("express");
const PasswordRecoveryController = require("../controllers/PasswordRecoveryController");
const router = express.Router();
const { redirectIfAuthenticated } = require('../middlewares/authMiddleware');

router.use(redirectIfAuthenticated);
router.get("/", PasswordRecoveryController.showPasswordRecoveryForm);


module.exports = router;
