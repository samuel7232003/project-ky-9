const cloudinary = require("cloudinary").v2;
const config = require("../config/index.js");
const { authenticateToken } = require("../middleware/auth.js");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const uploadController = {
  /**
   * Upload ảnh lên Cloudinary
   * POST /api/upload/image
   */
  uploadImage: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được upload" });
      }

      // Lấy các options từ body
      const { folder, public_id, width, height, crop, quality, format, tags } =
        req.body;

      // Tạo transformation object nếu có
      const transformations = {};
      if (width) transformations.width = parseInt(width);
      if (height) transformations.height = parseInt(height);
      if (crop) transformations.crop = crop;
      if (quality) {
        transformations.quality =
          quality === "auto" ? "auto" : parseInt(quality);
      }
      if (format) transformations.format = format;

      // Tạo upload options
      const uploadOptions = {};
      if (folder) uploadOptions.folder = folder;
      if (public_id) uploadOptions.public_id = public_id;
      if (Object.keys(transformations).length > 0) {
        uploadOptions.transformation = [transformations];
      }
      if (tags) {
        uploadOptions.tags = Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim());
      }

      // Upload lên Cloudinary (sử dụng buffer từ memory storage)
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            ...uploadOptions,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Ghi buffer vào stream
        uploadStream.end(req.file.buffer);
      });

      // Trả về kết quả
      res.status(200).json({
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Xóa ảnh khỏi Cloudinary
   * DELETE /api/upload/image/:publicId
   */
  deleteImage: async (req, res, next) => {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({ message: "Public ID không hợp lệ" });
      }

      // Xóa ảnh khỏi Cloudinary
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      if (result.result === "not found") {
        return res.status(404).json({ message: "Không tìm thấy ảnh" });
      }

      res.status(200).json({
        message: "Xóa ảnh thành công",
        result: result.result,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = uploadController;
