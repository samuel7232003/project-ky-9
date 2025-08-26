const { Router } = require("express");
const userController = require("../controllers/userController.js");
const { authenticateToken, requireRole } = require("../middleware/auth.js");
const {
  validateUser,
  validateUpdateProfile,
  validateChangePassword,
} = require("../middleware/validation.js");

const router = Router();

// Protected routes - require authentication
router.use(authenticateToken);

router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.post("/", requireRole(["admin"]), validateUser, userController.create);
router.put("/:id", requireRole(["admin"]), validateUser, userController.update);
router.delete("/:id", requireRole(["admin"]), userController.remove);

// Profile routes - user can update their own profile
router.put("/profile", validateUpdateProfile, userController.updateProfile);
router.put(
  "/change-password",
  validateChangePassword,
  userController.changePassword
);

module.exports = router;
