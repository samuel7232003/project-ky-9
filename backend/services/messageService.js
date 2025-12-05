const { Message } = require("../models/Message.js");
const { Conversation } = require("../models/Conversation.js");
const { User } = require("../models/User.js");
const { updateLastMessageAt } = require("./conversationService.js");
const { predictLeaf } = require("./leafClassificationService.js");

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

  // Tạo tin nhắn của user (không có classification)
  const message = await Message.create(data);

  // Update lastMessageAt của conversation
  await updateLastMessageAt(data.conversationId);

  // Nếu có ảnh, gọi ML server để phân loại và tạo tin nhắn hệ thống
  if (data.image) {
    // Chạy async, không chờ kết quả để trả về response nhanh
    processClassificationAndCreateSystemMessage(data.image, data.conversationId).catch((error) => {
      console.error("[Message Service] Failed to process classification:", error.message);
    });
  }

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

  // Nếu có conversationId, lấy tất cả messages trong conversation (bao gồm cả system messages)
  // Nếu không có conversationId nhưng có userId, chỉ lấy messages của user đó
  if (conversationId) {
    query.conversationId = conversationId;
    // Bao gồm cả system messages và messages của user
    if (userId) {
      query.$or = [
        { userId: userId },
        { isSystem: true }
      ];
    }
  } else if (userId) {
    query.userId = userId;
  }

  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [messages, total] = await Promise.all([
    Message.find(query)
      .populate({
        path: "userId",
        select: "username name avatar",
        strictPopulate: false, // Cho phép populate null userId (system messages)
      })
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
    .populate({
      path: "userId",
      select: "username name avatar",
      strictPopulate: false, // Cho phép populate null userId (system messages)
    })
    .populate("conversationId", "title")
    .lean();
  return message;
};

const updateMessageStatus = async (id, status) => {
  const message = await Message.findByIdAndUpdate(id, { status }, { new: true })
    .populate({
      path: "userId",
      select: "username name avatar",
      strictPopulate: false, // Cho phép populate null userId (system messages)
    })
    .populate("conversationId", "title")
    .lean();
  return message;
};

const deleteMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id).lean();
  return message;
};

/**
 * Xử lý phân loại ảnh và tạo tin nhắn hệ thống với kết quả
 * @param {string} imageUrl - URL của ảnh
 * @param {string} conversationId - ID của conversation
 */
const processClassificationAndCreateSystemMessage = async (imageUrl, conversationId) => {
  try {
    // Validate image URL format
    const url = typeof imageUrl === 'string' ? imageUrl.trim() : null;
    if (!url) {
      console.warn("[Message Service] Invalid image format, skipping classification");
      return;
    }

    console.log(`[Message Service] Starting classification for image: ${url}`);
    
    // Gọi ML server để phân loại
    const prediction = await predictLeaf(url);
    
    if (!prediction) {
      console.warn("[Message Service] Classification returned null (ML server unavailable)");
      return;
    }

    // Tạo classification object với cả tiếng Anh và tiếng Việt
    const classification = {
      plant: {
        name: prediction.plant.name_en || prediction.plant.name, // Tên tiếng Anh (mặc định)
        name_en: prediction.plant.name_en || prediction.plant.name,
        name_vi: prediction.plant.name_vi || prediction.plant.name,
        confidence: prediction.plant.confidence,
      },
      disease: {
        name: prediction.disease.name_en || prediction.disease.name, // Tên tiếng Anh (mặc định)
        name_en: prediction.disease.name_en || prediction.disease.name,
        name_vi: prediction.disease.name_vi || prediction.disease.name,
        confidence: prediction.disease.confidence,
      },
    };

    const plantNameVi = classification.plant.name_vi || classification.plant.name_en || classification.plant.name;
    const diseaseNameVi = classification.disease.name_vi || classification.disease.name_en || classification.disease.name;
    const plantNameEn = classification.plant.name_en || classification.plant.name;
    const diseaseNameEn = classification.disease.name_en || classification.disease.name;

    console.log(`[Message Service] Classification successful: ${plantNameEn} (${plantNameVi}) - ${diseaseNameEn} (${diseaseNameVi})`);

    // Tạo tin nhắn hệ thống với kết quả phân loại (hiển thị cả tiếng Anh và tiếng Việt)
    const systemMessageData = {
      conversationId,
      isSystem: true,
      classification,
      content: `🔍 Kết quả phân loại lá cây:\n• Cây: ${plantNameVi} (${plantNameEn}) - ${(classification.plant.confidence * 100).toFixed(1)}%\n• Bệnh: ${diseaseNameVi} (${diseaseNameEn}) - ${(classification.disease.confidence * 100).toFixed(1)}%`,
    };

    const systemMessage = await Message.create(systemMessageData);

    // Update lastMessageAt của conversation
    await updateLastMessageAt(conversationId);

    console.log(`[Message Service] System message created: ${systemMessage._id}`);
  } catch (error) {
    // Log error nhưng không throw để không ảnh hưởng đến user message
    console.error("[Message Service] Failed to process classification:", error.message);
    console.error("[Message Service] Error stack:", error.stack);
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  processClassificationAndCreateSystemMessage,
};
