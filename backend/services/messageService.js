const { Message } = require("../models/Message.js");
const { Conversation } = require("../models/Conversation.js");
const { User } = require("../models/User.js");
const { updateLastMessageAt } = require("./conversationService.js");

const createMessage = async (data) => {
  // Validate user exists
  const user = await User.findById(data.userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Validate conversation exists
  if (data.conversationId) {
    const conversation = await Conversation.findById(data.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Verify conversation belongs to user
    if (conversation.userId.toString() !== data.userId.toString()) {
      throw new Error("Conversation does not belong to user");
    }
  } else {
    throw new Error("Conversation ID is required");
  }

  // Validate: must have content or image
  if (!data.content && !data.image) {
    throw new Error("Message must have either content or image");
  }

  // Validate: chỉ cho phép 1 ảnh (không phải array)
  if (data.image && Array.isArray(data.image)) {
    throw new Error("Message can only have one image");
  }

  const message = await Message.create(data);

  // Update lastMessageAt của conversation
  await updateLastMessageAt(data.conversationId);

  // Populate userId và conversationId để lấy thông tin
  const populatedMessage = await Message.findById(message._id)
    .populate("userId", "username name avatar")
    .populate("conversationId", "title")
    .lean();

  return populatedMessage;
};

const getMessages = async (filters = {}) => {
  const { userId, conversationId, status, page = 1, limit = 10 } = filters;

  // Build query
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  if (conversationId) {
    query.conversationId = conversationId;
  }

  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [messages, total] = await Promise.all([
    Message.find(query)
      .populate("userId", "username name avatar")
      .populate("conversationId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Message.countDocuments(query),
  ]);

  return {
    messages,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
  };
};

const getMessageById = async (id) => {
  const message = await Message.findById(id)
    .populate("userId", "username name avatar")
    .populate("conversationId", "title")
    .lean();
  return message;
};

const updateMessageStatus = async (id, status) => {
  const message = await Message.findByIdAndUpdate(id, { status }, { new: true })
    .populate("userId", "username name avatar")
    .populate("conversationId", "title")
    .lean();
  return message;
};

const deleteMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id).lean();
  return message;
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
};
