const { Router } = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = Router();

// Cấu hình multer để xử lý file upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép upload file ảnh
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ được phép upload file ảnh"), false);
    }
  },
});

// Upload ảnh
router.post(
  "/image",
  authenticateToken,
  upload.single("image"),
  uploadController.uploadImage
);

// Xóa ảnh
router.delete(
  "/image/:publicId",
  authenticateToken,
  uploadController.deleteImage
);

module.exports = router;
