const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL của ảnh trên Cloudinary (chỉ cho phép 1 ảnh)
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.isSystem;
      },
      index: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "read", "archived"],
      default: "pending",
    },
    // Flag để đánh dấu tin nhắn từ hệ thống
    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Leaf classification results (tự động phân loại khi có ảnh)
    classification: {
      plant: {
        name: String, // Tên tiếng Anh (mặc định)
        name_en: String, // Tên tiếng Anh
        name_vi: String, // Tên tiếng Việt
        confidence: Number,
      },
      disease: {
        name: String, // Tên tiếng Anh (mặc định)
        name_en: String, // Tên tiếng Anh
        name_vi: String, // Tên tiếng Việt
        confidence: Number,
      },
      // Knowledge Graph information (từ Neo4j)
      kg_info: {
        nguyen_nhan: [String], // Mảng các nguyên nhân
        dieu_tri: [String], // Mảng các cách điều trị
      },
    },
  },
  { timestamps: true }
);

// Validation: Phải có content hoặc image hoặc classification (cho system message)
messageSchema.pre("validate", function (next) {
  if (!this.content && !this.image && !this.classification) {
    this.invalidate(
      "content",
      "Message must have either content, image, or classification"
    );
    this.invalidate(
      "image",
      "Message must have either content, image, or classification"
    );
  }
  next();
});

// Index cho query nhanh
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ status: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
