const { Message } = require("../models/Message.js");
const { Conversation } = require("../models/Conversation.js");
const { User } = require("../models/User.js");
const { updateLastMessageAt } = require("./conversationService.js");
const {
  predictLeaf,
  queryKnowledgeGraph,
} = require("./leafClassificationService.js");
const { emitNewMessage } = require("../config/socket.js");

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
    processClassificationAndCreateSystemMessage(
      data.image,
      data.conversationId
    ).catch((error) => {
      console.error(
        "[Message Service] Failed to process classification:",
        error.message
      );
    });
  }

  // Nếu chỉ có text (không có ảnh), gọi ML server để query Knowledge Graph
  if (data.content && !data.image) {
    // Chạy async, không chờ kết quả để trả về response nhanh
    processTextQueryAndCreateSystemMessage(
      data.content.trim(),
      data.conversationId
    ).catch((error) => {
      console.error(
        "[Message Service] Failed to process text query:",
        error.message
      );
    });
  }

  // Populate userId và conversationId để lấy thông tin
  const populatedMessage = await Message.findById(message._id)
    .populate("userId", "username name avatar")
    .populate("conversationId", "title")
    .lean();

  // Không emit WebSocket event cho user messages vì frontend đã có message đó rồi
  // Chỉ emit cho system messages (được tạo bởi processClassificationAndCreateSystemMessage hoặc processTextQueryAndCreateSystemMessage)

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
      query.$or = [{ userId: userId }, { isSystem: true }];
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
const processClassificationAndCreateSystemMessage = async (
  imageUrl,
  conversationId
) => {
  try {
    // Validate image URL format
    const url = typeof imageUrl === "string" ? imageUrl.trim() : null;
    if (!url) {
      console.warn(
        "[Message Service] Invalid image format, skipping classification"
      );
      return;
    }

    console.log(`[Message Service] Starting classification for image: ${url}`);

    // Gọi ML server để phân loại
    const prediction = await predictLeaf(url);

    if (!prediction) {
      console.warn(
        "[Message Service] Classification returned null (ML server unavailable)"
      );
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
      // Thêm kg_info nếu có
      kg_info: prediction.kg_info || null,
    };

    const plantNameVi =
      classification.plant.name_vi ||
      classification.plant.name_en ||
      classification.plant.name;
    const diseaseNameVi =
      classification.disease.name_vi ||
      classification.disease.name_en ||
      classification.disease.name;
    const plantNameEn =
      classification.plant.name_en || classification.plant.name;
    const diseaseNameEn =
      classification.disease.name_en || classification.disease.name;

    console.log(
      `[Message Service] Classification successful: ${plantNameEn} (${plantNameVi}) - ${diseaseNameEn} (${diseaseNameVi})`
    );

    // Tạo content message - hiển thị cả kết quả từ model và từ KG
    let content = '';
    
    // Phần 1: Kết quả từ model hình ảnh
    content += `🔍 Kết quả phân loại lá cây (từ model):\n• Cây: ${plantNameVi} (${plantNameEn}) - ${(
      classification.plant.confidence * 100
    ).toFixed(1)}%\n• Bệnh: ${diseaseNameVi} (${diseaseNameEn}) - ${(
      classification.disease.confidence * 100
    ).toFixed(1)}%\n`;
    
    // Phần 2: Thông tin từ Knowledge Graph (nếu có)
    if (classification.kg_info && 
        (classification.kg_info.nguyen_nhan?.length > 0 || classification.kg_info.dieu_tri?.length > 0)) {
      content += '\n📊 Thông tin từ Knowledge Graph:\n';
      
      if (classification.kg_info.nguyen_nhan && classification.kg_info.nguyen_nhan.length > 0) {
        content += '🌱 Nguyên nhân:\n';
        classification.kg_info.nguyen_nhan.forEach((nn) => {
          content += `• ${nn}\n`;
        });
      }
      
      if (classification.kg_info.dieu_tri && classification.kg_info.dieu_tri.length > 0) {
        content += '💊 Cách điều trị:\n';
        classification.kg_info.dieu_tri.forEach((dt) => {
          content += `• ${dt}\n`;
        });
      }
    }

    // Tạo tin nhắn hệ thống với kết quả từ KG hoặc model
    const systemMessageData = {
      conversationId,
      isSystem: true,
      classification,
      content,
    };

    const systemMessage = await Message.create(systemMessageData);

    // Update lastMessageAt của conversation
    await updateLastMessageAt(conversationId);

    // Populate system message để emit qua WebSocket
    const populatedSystemMessage = await Message.findById(systemMessage._id)
      .populate({
        path: "userId",
        select: "username name avatar",
        strictPopulate: false,
      })
      .populate("conversationId", "title")
      .lean();

    // Emit WebSocket event for new system message (if io is available)
    const io = global.io;
    if (io) {
      emitNewMessage(io, conversationId, populatedSystemMessage);
    }

    console.log(
      `[Message Service] System message created: ${systemMessage._id}`
    );
  } catch (error) {
    // Log error nhưng không throw để không ảnh hưởng đến user message
    console.error(
      "[Message Service] Failed to process classification:",
      error.message
    );
    console.error("[Message Service] Error stack:", error.stack);
  }
};

/**
 * Xử lý text query và tạo tin nhắn hệ thống với kết quả từ Knowledge Graph
 * @param {string} queryText - Text query từ user
 * @param {string} conversationId - ID của conversation
 */
const processTextQueryAndCreateSystemMessage = async (
  queryText,
  conversationId
) => {
  try {
    // Validate query text
    const text = typeof queryText === "string" ? queryText.trim() : null;
    if (!text || text.length === 0) {
      console.warn("[Message Service] Invalid query text, skipping KG query");
      return;
    }

    console.log(`[Message Service] Starting KG query for text: ${text}`);

    // Gọi ML server để query Knowledge Graph
    const kgResult = await queryKnowledgeGraph(text);

    if (!kgResult) {
      console.warn(
        "[Message Service] KG query returned null (ML server unavailable)"
      );
      return;
    }

    // Xử lý kết quả từ KG
    let systemMessageContent = "";
    let classification = null;

    if (kgResult.type === "direct_answer") {
      // Nếu là direct answer (không phải câu hỏi về bệnh cây)
      systemMessageContent = `💬 ${
        kgResult.answer || "Không thể tìm thấy thông tin."
      }`;
    } else if (kgResult.type === "search_results" && kgResult.results) {
      // Nếu là search results (câu hỏi về bệnh cây)
      const results = Array.isArray(kgResult.results) ? kgResult.results : [];

      if (results.length > 0) {
        systemMessageContent = "🔍 Kết quả tìm kiếm từ hệ thống tri thức:\n\n";

        results.forEach((result, index) => {
          const cay = result.cay || "N/A";
          const benh = result.benh || "N/A";
          const description = result.text || result.description || "";

          systemMessageContent += `${index + 1}. **${cay}** - ${benh}\n`;
          if (description) {
            // Loại bỏ phần "có các triệu chứng như sau:" nếu có
            let cleanDescription = description.trim();
            if (cleanDescription.includes("có các triệu chứng như sau:")) {
              cleanDescription = cleanDescription
                .split("có các triệu chứng như sau:")[1]
                .trim();
            }
            systemMessageContent += `   ${cleanDescription}\n`;
          }
          systemMessageContent += "\n";
        });
      } else {
        systemMessageContent =
          "❌ Không tìm thấy kết quả phù hợp trong hệ thống tri thức.";
      }
    } else {
      systemMessageContent = "❌ Không thể xử lý câu hỏi. Vui lòng thử lại.";
    }

    // Tạo tin nhắn hệ thống với kết quả từ KG
    const systemMessageData = {
      conversationId,
      isSystem: true,
      content: systemMessageContent,
      // Không có classification cho text query, chỉ có content
    };

    // Nếu có classification từ kết quả (trong trường hợp đặc biệt)
    if (classification) {
      systemMessageData.classification = classification;
    }

    const systemMessage = await Message.create(systemMessageData);

    // Update lastMessageAt của conversation
    await updateLastMessageAt(conversationId);

    // Populate system message để emit qua WebSocket
    const populatedSystemMessage = await Message.findById(systemMessage._id)
      .populate({
        path: "userId",
        select: "username name avatar",
        strictPopulate: false,
      })
      .populate("conversationId", "title")
      .lean();

    // Emit WebSocket event for new system message (if io is available)
    const io = global.io;
    if (io) {
      emitNewMessage(io, conversationId, populatedSystemMessage);
    }

    console.log(
      `[Message Service] System message created for text query: ${systemMessage._id}`
    );
  } catch (error) {
    // Log error nhưng không throw để không ảnh hưởng đến user message
    console.error(
      "[Message Service] Failed to process text query:",
      error.message
    );
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
  processTextQueryAndCreateSystemMessage,
};
