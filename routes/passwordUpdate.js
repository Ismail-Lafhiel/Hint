const express = require("express");
const PasswordUpdateController = require("../controllers/PasswordUpdateController");
const router = express.Router();

router.get("/", PasswordUpdateController.showPasswordUpdateForm);
router.post("/", PasswordUpdateController.updatePassword);
module.exports = router;
