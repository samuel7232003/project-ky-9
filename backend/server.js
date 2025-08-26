const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const router = require("./routes/index.js");
const { connectToDatabase } = require("./config/db.js");
const config = require("./config/index.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan(config.logLevel));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api", router);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

const start = async () => {
  try {
    await connectToDatabase();
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📡 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();
