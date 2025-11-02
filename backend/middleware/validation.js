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
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username must be between 3-20 characters and contain only letters, numbers, and underscores"
    ),

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

// Validation rules cho message
const validateMessage = [
  body("content")
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage("Content must not exceed 10000 characters"),

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL")
    .custom((value) => {
      // Đảm bảo image không phải là array - chỉ cho phép 1 ảnh
      if (Array.isArray(value)) {
        throw new Error("Message can only have one image");
      }
      return true;
    }),

  // Custom validation: must have content or image
  body().custom((value) => {
    if (!value.content && !value.image) {
      throw new Error("Message must have either content or image");
    }
    // Đảm bảo image không phải là array
    if (value.image && Array.isArray(value.image)) {
      throw new Error("Message can only have one image");
    }
    return true;
  }),

  handleValidationErrors,
];

module.exports = {
  validateUser,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateMessage,
  handleValidationErrors,
};
