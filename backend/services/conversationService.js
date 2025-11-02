const { Conversation } = require("../models/Conversation.js");
const { Message } = require("../models/Message.js");
const { User } = require("../models/User.js");

const createConversation = async (data) => {
  // Validate user exists
  const user = await User.findById(data.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const conversation = await Conversation.create({
    userId: data.userId,
    title: data.title || "Trò chuyện mới",
  });

  return conversation;
};

const getConversations = async (filters = {}) => {
  const { userId, page = 1, limit = 20 } = filters;

  // Build query
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [conversations, total] = await Promise.all([
    Conversation.find(query)
      .populate("userId", "username name avatar")
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Conversation.countDocuments(query),
  ]);

  return {
    conversations,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
  };
};

const getConversationById = async (id) => {
  const conversation = await Conversation.findById(id)
    .populate("userId", "username name avatar")
    .lean();
  return conversation;
};

const updateConversation = async (id, data) => {
  const conversation = await Conversation.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }
  )
    .populate("userId", "username name avatar")
    .lean();
  return conversation;
};

const deleteConversation = async (id) => {
  // Xóa tất cả messages của conversation trước
  await Message.deleteMany({ conversationId: id });

  // Sau đó xóa conversation
  const conversation = await Conversation.findByIdAndDelete(id).lean();
  return conversation;
};

// Update lastMessageAt khi có message mới
const updateLastMessageAt = async (conversationId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: new Date(),
  });
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
  updateLastMessageAt,
};
