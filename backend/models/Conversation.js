const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Trò chuyện mới",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index cho query nhanh
conversationSchema.index({ userId: 1, lastMessageAt: -1 });
conversationSchema.index({ createdAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = { Conversation };
