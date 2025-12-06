import { apiInstance } from './api';

// Interface cho message filters
export interface MessageFilters {
  userId?: string;
  conversationId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Interface cho user info trong message
export interface MessageUser {
  _id: string;
  username: string;
  name: string;
  avatar?: string;
}

// Interface cho conversation info trong message
export interface MessageConversation {
  _id: string;
  title: string;
}

// Interface cho classification results
export interface ClassificationResult {
  plant: {
    name: string; // Tên tiếng Anh (mặc định)
    name_en?: string; // Tên tiếng Anh
    name_vi?: string; // Tên tiếng Việt
    confidence: number;
  };
  disease: {
    name: string; // Tên tiếng Anh (mặc định)
    name_en?: string; // Tên tiếng Anh
    name_vi?: string; // Tên tiếng Việt
    confidence: number;
  };
  // Knowledge Graph information (từ Neo4j)
  kg_info?: {
    nguyen_nhan?: string[]; // Mảng các nguyên nhân
    dieu_tri?: string[]; // Mảng các cách điều trị
  };
}

// Interface cho message response
export interface MessageResponse {
  _id: string;
  content?: string;
  image?: string;
  userId?: MessageUser; // Optional vì system messages không có userId
  conversationId: MessageConversation | string;
  status: 'pending' | 'read' | 'archived';
  isSystem?: boolean; // Flag để đánh dấu tin nhắn từ hệ thống
  classification?: ClassificationResult;
  createdAt: string;
  updatedAt: string;
}

// Interface cho message list response
export interface MessageListResponse {
  messages: MessageResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface cho create message request
// Lưu ý: Mỗi tin nhắn chỉ cho phép gửi 1 ảnh duy nhất
export interface CreateMessageRequest {
  content?: string;
  image?: string; // URL của ảnh (chỉ cho phép 1 ảnh, không phải array)
  conversationId: string; // ID của conversation
}

// Interface cho update message status request
export interface UpdateMessageStatusRequest {
  status: 'pending' | 'read' | 'archived';
}

// Service cho message management
export const messageService = {
  /**
   * Gửi tin nhắn mới (phải có content hoặc image)
   * Lưu ý: Mỗi tin nhắn chỉ cho phép gửi 1 ảnh duy nhất, và phải có conversationId
   * @param messageData - Dữ liệu tin nhắn (image phải là string, không phải array)
   * @returns Message response
   */
  async createMessage(messageData: CreateMessageRequest): Promise<MessageResponse> {
    // Validate: phải có conversationId
    if (!messageData.conversationId) {
      throw new Error('Conversation ID is required');
    }

    // Validate: phải có content hoặc image
    if (!messageData.content && !messageData.image) {
      throw new Error('Message must have either content or image');
    }

    // Validate: chỉ cho phép 1 ảnh (không phải array)
    if (messageData.image && Array.isArray(messageData.image as any)) {
      throw new Error('Message can only have one image');
    }

    const response = await apiInstance.post<MessageResponse>(
      '/messages',
      messageData
    );
    return response.data;
  },

  /**
   * Gửi tin nhắn với ảnh (upload ảnh lên Cloudinary trước)
   * Lưu ý: Chỉ upload và gửi 1 ảnh duy nhất, và phải có conversationId
   * @param file - File ảnh cần upload (chỉ 1 file)
   * @param conversationId - ID của conversation
   * @param content - Nội dung tin nhắn (optional)
   * @param uploadOptions - Cloudinary upload options (optional)
   * @returns Message response
   */
  async createMessageWithImage(
    file: File | Blob,
    conversationId: string,
    content?: string,
    uploadOptions?: any
  ): Promise<MessageResponse> {
    // Import cloudinary service dynamically để tránh circular dependency
    const { cloudinaryService } = await import('./cloudinaryService');

    // Upload ảnh lên Cloudinary
    const uploadResult = await cloudinaryService.uploadImage(file, {
      folder: 'messages',
      ...uploadOptions,
    });

    // Tạo message với image URL
    return this.createMessage({
      content,
      image: uploadResult.secureUrl,
      conversationId,
    });
  },

  /**
   * Lấy danh sách tin nhắn
   * @param filters - Filters cho query
   * @returns Message list response
   */
  async getMessages(filters: MessageFilters = {}): Promise<MessageListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiInstance.get<MessageListResponse>(
      `/messages?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Lấy thông tin tin nhắn theo ID
   * @param id - Message ID
   * @returns Message response
   */
  async getMessageById(id: string): Promise<MessageResponse> {
    const response = await apiInstance.get<MessageResponse>(`/messages/${id}`);
    return response.data;
  },

  /**
   * Cập nhật status của tin nhắn
   * @param id - Message ID
   * @param status - Status mới
   * @returns Message response
   */
  async updateMessageStatus(
    id: string,
    status: 'pending' | 'read' | 'archived'
  ): Promise<MessageResponse> {
    const response = await apiInstance.put<MessageResponse>(
      `/messages/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Xóa tin nhắn
   * @param id - Message ID
   * @returns void
   */
  async deleteMessage(id: string): Promise<void> {
    await apiInstance.delete(`/messages/${id}`);
  },
};

