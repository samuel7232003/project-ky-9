import { apiInstance } from './api';

// Interface cho conversation filters
export interface ConversationFilters {
  userId?: string;
  page?: number;
  limit?: number;
}

// Interface cho conversation response
export interface ConversationResponse {
  _id: string;
  userId: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho conversation list response
export interface ConversationListResponse {
  conversations: ConversationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface cho create conversation request
export interface CreateConversationRequest {
  title?: string;
}

// Interface cho update conversation request
export interface UpdateConversationRequest {
  title?: string;
}

// Service cho conversation management
export const conversationService = {
  /**
   * Tạo conversation mới
   * @param conversationData - Dữ liệu conversation
   * @returns Conversation response
   */
  async createConversation(conversationData: CreateConversationRequest): Promise<ConversationResponse> {
    const response = await apiInstance.post<ConversationResponse>(
      '/conversations',
      conversationData
    );
    return response.data;
  },

  /**
   * Lấy danh sách conversations
   * @param filters - Filters cho query
   * @returns Conversation list response
   */
  async getConversations(filters: ConversationFilters = {}): Promise<ConversationListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiInstance.get<ConversationListResponse>(
      `/conversations?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Lấy thông tin conversation theo ID
   * @param id - Conversation ID
   * @returns Conversation response
   */
  async getConversationById(id: string): Promise<ConversationResponse> {
    const response = await apiInstance.get<ConversationResponse>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Cập nhật conversation
   * @param id - Conversation ID
   * @param conversationData - Dữ liệu cập nhật
   * @returns Conversation response
   */
  async updateConversation(
    id: string,
    conversationData: UpdateConversationRequest
  ): Promise<ConversationResponse> {
    const response = await apiInstance.put<ConversationResponse>(
      `/conversations/${id}`,
      conversationData
    );
    return response.data;
  },

  /**
   * Xóa conversation
   * @param id - Conversation ID
   * @returns void
   */
  async deleteConversation(id: string): Promise<void> {
    await apiInstance.delete(`/conversations/${id}`);
  },
};

