const axios = require("axios");

const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:5001";

/**
 * Predict plant and disease from image URL
 * @param {string} imageUrl - URL của ảnh
 * @returns {Promise<Object>} Prediction result với plant và disease
 */
const predictLeaf = async (imageUrl) => {
  try {
    // Validate image URL
    if (!imageUrl || typeof imageUrl !== "string") {
      console.error("Invalid image URL provided:", imageUrl);
      throw new Error("Invalid image URL");
    }

    // Log request details for debugging
    console.log(
      `[Leaf Classification] Sending request to ML server: ${ML_SERVER_URL}/predict`
    );
    console.log(`[Leaf Classification] Image URL: ${imageUrl}`);

    const response = await axios.post(
      `${ML_SERVER_URL}/predict`,
      {
        image_url: imageUrl,
      },
      {
        timeout: 30000, // 30 seconds timeout for image processing
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Prediction failed");
    }

    console.log(
      `[Leaf Classification] Success: Plant=${response.data.plant?.name}, Disease=${response.data.disease?.name}`
    );
    return {
      plant: response.data.plant,
      disease: response.data.disease,
    };
  } catch (error) {
    // Log detailed error information
    console.error("[Leaf Classification] Error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      url: imageUrl,
      mlServerUrl: ML_SERVER_URL,
    });

    // Nếu ML server không available, return null thay vì throw error
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      console.warn(
        `[Leaf Classification] ML server at ${ML_SERVER_URL} is not available, skipping classification`
      );
      return null;
    }

    throw new Error(
      error.response?.data?.error || error.message || "Failed to classify leaf"
    );
  }
};

/**
 * Check if ML server is healthy
 * @returns {Promise<boolean>} True if server is healthy
 */
const checkMLServerHealth = async () => {
  try {
    const response = await axios.get(`${ML_SERVER_URL}/health`, {
      timeout: 5000, // 5 seconds timeout
    });
    return response.data.status === "ok" && response.data.model_loaded;
  } catch (error) {
    console.warn("ML server health check failed:", error.message);
    return false;
  }
};

module.exports = {
  predictLeaf,
  checkMLServerHealth,
};
