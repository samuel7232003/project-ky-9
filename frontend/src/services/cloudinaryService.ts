import { apiInstance } from './api';

// Interface cho Cloudinary upload options
export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  };
  tags?: string[];
}

// Interface cho Cloudinary upload response
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

// Interface cho upload result
export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

// Service cho Cloudinary upload
export const cloudinaryService = {
  /**
   * Upload ảnh lên Cloudinary qua backend API
   * @param file - File object cần upload
   * @param options - Cloudinary upload options
   * @returns Upload result với URL và metadata
   */
  async uploadImage(
    file: File | Blob,
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('image', file);

    // Thêm các options vào form data
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.publicId) {
      formData.append('public_id', options.publicId);
    }
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    // Thêm transformation options
    if (options.transformation) {
      const transformation = options.transformation;
      if (transformation.width) {
        formData.append('width', transformation.width.toString());
      }
      if (transformation.height) {
        formData.append('height', transformation.height.toString());
      }
      if (transformation.crop) {
        formData.append('crop', transformation.crop);
      }
      if (transformation.quality) {
        formData.append('quality', transformation.quality.toString());
      }
      if (transformation.format) {
        formData.append('format', transformation.format);
      }
    }

    try {
      const response = await apiInstance.post<CloudinaryUploadResponse>(
        '/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        url: response.data.url,
        secureUrl: response.data.secure_url,
        publicId: response.data.public_id,
        width: response.data.width,
        height: response.data.height,
        format: response.data.format,
        size: response.data.bytes,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Không thể upload ảnh lên Cloudinary'
      );
    }
  },

  /**
   * Upload nhiều ảnh cùng lúc qua backend API
   * @param files - Array của File objects
   * @param options - Cloudinary upload options
   * @returns Array của upload results
   */
  async uploadMultipleImages(
    files: (File | Blob)[],
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file, options)
    );
    return Promise.all(uploadPromises);
  },

  /**
   * Xóa ảnh khỏi Cloudinary qua backend API
   * @param publicId - Public ID của ảnh cần xóa
   * @returns void
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await apiInstance.delete(`/upload/image/${publicId}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Không thể xóa ảnh khỏi Cloudinary'
      );
    }
  },
};

