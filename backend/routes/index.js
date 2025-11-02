const { Router } = require("express");
const userRoutes = require("./userRoutes.js");
const authRoutes = require("./authRoutes.js");
const uploadRoutes = require("./uploadRoutes.js");
const messageRoutes = require("./messageRoutes.js");
const conversationRoutes = require("./conversationRoutes.js");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/messages", messageRoutes);
router.use("/conversations", conversationRoutes);

module.exports = router;
