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
      required: true,
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
  },
  { timestamps: true }
);

// Validation: Phải có content hoặc image
messageSchema.pre("validate", function (next) {
  if (!this.content && !this.image) {
    this.invalidate("content", "Message must have either content or image");
    this.invalidate("image", "Message must have either content or image");
  }
  next();
});

// Index cho query nhanh
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ status: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
