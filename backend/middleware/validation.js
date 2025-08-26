const { body, validationResult } = require("express-validator");

// Middleware để xử lý validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

// Validation rules cho user
const validateUser = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username must be between 3-20 characters and contain only letters, numbers, and underscores"
    ),

  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),

  handleValidationErrors,
];

// Validation rules cho login
const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// Validation rules cho update profile
const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters"),

  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),

  body("phone")
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Invalid phone number format"),

  handleValidationErrors,
];

// Validation rules cho change password
const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  handleValidationErrors,
];

module.exports = {
  validateUser,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  handleValidationErrors,
};
