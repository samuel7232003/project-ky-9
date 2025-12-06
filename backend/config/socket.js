const { Server } = require("socket.io");
const { verifyToken } = require("./jwt.js");
const { User } = require("../models/User.js");

/**
 * Setup Socket.IO server with authentication
 * @param {http.Server} server - HTTP server instance
 * @param {string} corsOrigin - CORS origin for Socket.IO
 * @returns {Server} Socket.IO server instance
 */
const setupSocketIO = (server, corsOrigin) => {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      // Get token from handshake auth, query, or cookies
      let token = socket.handshake.auth?.token || socket.handshake.query?.token;
      
      // If no token in auth/query, try to get from cookies
      if (!token && socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'token') {
            token = decodeURIComponent(value);
            break;
          }
        }
      }
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify token
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach user to socket
      socket.userId = user._id.toString();
      socket.user = user;
      
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Handle connection
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join room for user's conversations
    socket.join(`user:${socket.userId}`);

    // Handle join conversation room
    socket.on("join_conversation", (conversationId) => {
      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
        console.log(`📨 User ${socket.userId} joined conversation: ${conversationId}`);
      }
    });

    // Handle leave conversation room
    socket.on("leave_conversation", (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
        console.log(`📤 User ${socket.userId} left conversation: ${conversationId}`);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

/**
 * Emit new message to conversation room
 * @param {Server} io - Socket.IO server instance
 * @param {string} conversationId - Conversation ID
 * @param {Object} message - Message object
 */
const emitNewMessage = (io, conversationId, message) => {
  if (io && conversationId && message) {
    io.to(`conversation:${conversationId}`).emit("new_message", message);
    console.log(`📤 Emitted new message to conversation: ${conversationId}`);
  }
};

module.exports = {
  setupSocketIO,
  emitNewMessage,
};

