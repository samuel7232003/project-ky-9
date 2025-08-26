const { Router } = require("express");
const authController = require("../controllers/authController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { validateUser, validateLogin } = require("../middleware/validation.js");

const router = Router();

router.post("/register", validateUser, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authController.logout);
router.get("/verify", authenticateToken, authController.verify);
router.get("/me", authenticateToken, authController.getProfile);
router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;
