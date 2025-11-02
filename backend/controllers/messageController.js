const messageService = require("../services/messageService.js");

const createMessage = async (req, res, next) => {
  try {
    const { content, image, conversationId } = req.body;
    const userId = req.user._id; // Lấy userId từ authenticated user

    // Validate conversationId
    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation ID is required",
      });
    }

    // Validate: must have content or image
    if (!content && !image) {
      return res.status(400).json({
        message: "Message must have either content or image",
      });
    }

    // Validate: chỉ cho phép 1 ảnh (không phải array)
    if (image && Array.isArray(image)) {
      return res.status(400).json({
        message: "Message can only have one image",
      });
    }

    const message = await messageService.createMessage({
      content: content?.trim(),
      image: image?.trim(), // Đảm bảo image là string, không phải array
      userId,
      conversationId,
    });

    res.status(201).json(message);
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Conversation not found" ||
      error.message === "Conversation does not belong to user"
    ) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Conversation ID is required") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { userId, conversationId, status, page, limit } = req.query;

    // Nếu là user thường, chỉ lấy message của chính họ
    // Nếu là admin, có thể lấy tất cả hoặc filter theo userId
    const filters = {
      userId: req.user.role === "admin" ? userId : req.user._id,
      conversationId,
      status,
      page,
      limit,
    };

    // Remove undefined values
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    const result = await messageService.getMessages(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const message = await messageService.getMessageById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // User chỉ có thể xem message của chính họ, admin có thể xem tất cả
    if (
      req.user.role !== "admin" &&
      message.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "read", "archived"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const message = await messageService.getMessageById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // User chỉ có thể update message của chính họ, admin có thể update tất cả
    if (
      req.user.role !== "admin" &&
      message.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await messageService.updateMessageStatus(id, status);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await messageService.getMessageById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // User chỉ có thể xóa message của chính họ, admin có thể xóa tất cả
    if (
      req.user.role !== "admin" &&
      message.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await messageService.deleteMessage(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
};
