const dotenv = require("dotenv");

dotenv.config();

const config = {
  // Server config
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB config
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
  mongoDb: process.env.MONGO_DB || "nckh",

  // JWT config
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // CORS config
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Logging
  logLevel: process.env.LOG_LEVEL || "dev",

  // Cloudinary config
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

// Validate required config
const requiredConfigs = ["jwtSecret"];
for (const configKey of requiredConfigs) {
  if (!config[configKey]) {
    throw new Error(`Missing required config: ${configKey}`);
  }
}

module.exports = config;
