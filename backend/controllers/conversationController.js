const conversationService = require("../services/conversationService.js");

const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user._id; // Lấy userId từ authenticated user

    const conversation = await conversationService.createConversation({
      userId,
      title: title?.trim() || "Trò chuyện mới",
    });

    res.status(201).json(conversation);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    // User chỉ có thể lấy conversations của chính họ
    const filters = {
      userId: req.user._id,
      page,
      limit,
    };

    // Remove undefined values
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    const result = await conversationService.getConversations(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const conversation = await conversationService.getConversationById(
      req.params.id
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // User chỉ có thể xem conversation của chính họ
    if (conversation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

const updateConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const conversation = await conversationService.getConversationById(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // User chỉ có thể update conversation của chính họ
    if (conversation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await conversationService.updateConversation(id, {
      title: title?.trim(),
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await conversationService.getConversationById(
      req.params.id
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // User chỉ có thể xóa conversation của chính họ
    if (conversation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await conversationService.deleteConversation(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
};
