const { Router } = require("express");
const messageController = require("../controllers/messageController.js");
const { authenticateToken, requireRole } = require("../middleware/auth.js");
const { validateMessage } = require("../middleware/validation.js");

const router = Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Tạo tin nhắn mới
router.post("/", validateMessage, messageController.createMessage);

// Lấy danh sách tin nhắn (user chỉ lấy của mình, admin lấy tất cả)
router.get("/", messageController.getMessages);

// Lấy tin nhắn theo ID
router.get("/:id", messageController.getMessageById);

// Cập nhật status của tin nhắn
router.put("/:id/status", messageController.updateMessageStatus);

// Xóa tin nhắn
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
