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

    // Log KG info if available
    if (response.data.kg_info) {
      console.log(
        `[Leaf Classification] KG Info found: ${
          response.data.kg_info.nguyen_nhan?.length || 0
        } nguyên nhân, ${
          response.data.kg_info.dieu_tri?.length || 0
        } cách điều trị`
      );
    }

    return {
      plant: response.data.plant,
      disease: response.data.disease,
      kg_info: response.data.kg_info || null, // Thêm kg_info vào response
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
 * Query Knowledge Graph by text
 * @param {string} queryText - Text query từ user
 * @returns {Promise<Object>} Query result từ KG
 */
const queryKnowledgeGraph = async (queryText) => {
  try {
    // Validate query text
    if (!queryText || typeof queryText !== "string" || !queryText.trim()) {
      console.error("Invalid query text provided:", queryText);
      throw new Error("Invalid query text");
    }

    // Log request details for debugging
    console.log(
      `[KG Query] Sending request to ML server: ${ML_SERVER_URL}/query/text`
    );
    console.log(`[KG Query] Query text: ${queryText}`);

    const response = await axios.post(
      `${ML_SERVER_URL}/query/text`,
      {
        query: queryText.trim(),
      },
      {
        timeout: 30000, // 30 seconds timeout for KG query
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "KG query failed");
    }

    console.log(`[KG Query] Success: type=${response.data.type}`);

    return response.data;
  } catch (error) {
    // Log detailed error information
    console.error("[KG Query] Error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      queryText: queryText,
      mlServerUrl: ML_SERVER_URL,
    });

    // Nếu ML server không available, return null thay vì throw error
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      console.warn(
        `[KG Query] ML server at ${ML_SERVER_URL} is not available, skipping KG query`
      );
      return null;
    }

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to query knowledge graph"
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
  queryKnowledgeGraph,
  checkMLServerHealth,
};
