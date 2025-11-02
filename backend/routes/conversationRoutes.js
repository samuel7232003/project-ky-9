const { Router } = require("express");
const conversationController = require("../controllers/conversationController.js");
const { authenticateToken } = require("../middleware/auth.js");

const router = Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Tạo conversation mới
router.post("/", conversationController.createConversation);

// Lấy danh sách conversations
router.get("/", conversationController.getConversations);

// Lấy conversation theo ID
router.get("/:id", conversationController.getConversationById);

// Cập nhật conversation
router.put("/:id", conversationController.updateConversation);

// Xóa conversation
router.delete("/:id", conversationController.deleteConversation);

module.exports = router;
