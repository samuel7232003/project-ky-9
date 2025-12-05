import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  messageService, 
  MessageResponse, 
  conversationService,
  ConversationResponse,
  ConversationFilters,
} from '../../../services';

// Interface cho send message payload
interface SendMessagePayload {
  conversationId: string;
  content?: string;
  file?: File | Blob;
  uploadOptions?: {
    folder?: string;
    transformation?: {
      quality?: string;
      format?: string;
    };
  };
}

// Interface cho knowledge lib state
interface KnowledgeLibState {
  messages: MessageResponse[];
  conversations: ConversationResponse[];
  currentConversationId: string | null;
  loading: boolean; // Loading khi send message
  loadingMessages: boolean; // Loading khi load messages
  loadingConversations: boolean; // Loading khi load conversations
  error: string | null;
}

// Initial state
const initialState: KnowledgeLibState = {
  messages: [],
  conversations: [],
  currentConversationId: null,
  loading: false,
  loadingMessages: true,
  loadingConversations: true,
  error: null,
};

// Async thunk cho load conversations
export const loadConversations = createAsyncThunk(
  'knowledgeLib/loadConversations',
  async (filters: ConversationFilters = {}, { rejectWithValue }) => {
    try {
      const response = await conversationService.getConversations({
        limit: 50, // Load 50 conversations gần nhất
        page: 1,
        ...filters,
      });
      return response.conversations;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải danh sách cuộc trò chuyện');
    }
  }
);

// Async thunk cho create conversation
export const createConversation = createAsyncThunk(
  'knowledgeLib/createConversation',
  async (title: string = 'Trò chuyện mới', { rejectWithValue }) => {
    try {
      const conversation = await conversationService.createConversation({
        title,
      });
      return conversation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tạo cuộc trò chuyện mới');
    }
  }
);

// Async thunk cho update conversation title
export const updateConversationTitle = createAsyncThunk(
  'knowledgeLib/updateConversationTitle',
  async (
    { id, title }: { id: string; title: string },
    { rejectWithValue }
  ) => {
    try {
      const updatedConversation = await conversationService.updateConversation(id, {
        title,
      });
      return updatedConversation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể cập nhật tiêu đề cuộc trò chuyện');
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'knowledgeLib/deleteConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await conversationService.deleteConversation(conversationId);
      return conversationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể xóa cuộc trò chuyện');
    }
  }
);

// Async thunk cho load messages
export const loadMessages = createAsyncThunk(
  'knowledgeLib/loadMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await messageService.getMessages({
        conversationId,
        limit: 50, // Load 50 messages gần nhất
        page: 1,
      });
      // Đảo ngược để hiển thị message mới nhất ở đầu
      return response.messages.reverse();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải danh sách tin nhắn');
    }
  }
);

// Async thunk cho send message
export const sendMessage = createAsyncThunk(
  'knowledgeLib/sendMessage',
  async (payload: SendMessagePayload, { rejectWithValue }) => {
    try {
      const { conversationId, content, file, uploadOptions } = payload;
      
      // Validate
      if (!content?.trim() && !file) {
        return rejectWithValue('Vui lòng nhập nội dung hoặc chọn ảnh');
      }

      let result: MessageResponse;
      
      if (file) {
        // Gửi tin nhắn có kèm ảnh
        result = await messageService.createMessageWithImage(
          file,
          conversationId,
          content?.trim() || undefined,
          uploadOptions || {
            folder: 'messages',
            transformation: {
              quality: 'auto',
              format: 'auto',
            },
          }
        );
      } else {
        // Gửi tin nhắn chỉ có text
        result = await messageService.createMessage({
          content: content?.trim() || '',
          conversationId,
        });
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi gửi tin nhắn');
    }
  }
);

// Knowledge lib slice
const knowledgeLibSlice = createSlice({
  name: 'knowledgeLib',
  initialState,
  reducers: {
    setCurrentConversationId: (state, action: PayloadAction<string | null>) => {
      // Chỉ thay đổi nếu conversationId khác với hiện tại
      if (state.currentConversationId !== action.payload) {
        state.currentConversationId = action.payload;
        state.messages = [];
        // Nếu không có conversationId, set loadingMessages = false
        if (!action.payload) {
          state.loadingMessages = false;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.loadingMessages = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.messages = [];
      state.currentConversationId = null;
      state.loading = false;
      state.loadingMessages = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load conversations
    builder
      .addCase(loadConversations.pending, (state) => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(loadConversations.fulfilled, (state, action: PayloadAction<ConversationResponse[]>) => {
        state.loadingConversations = false;
        
        // Merge conversations mới với conversations hiện tại, loại bỏ duplicate
        const existingIds = new Set(state.conversations.map(conv => conv._id));
        const newConversations = action.payload.filter(conv => !existingIds.has(conv._id));
        state.conversations = [...newConversations, ...state.conversations];
        
        // Sắp xếp lại theo lastMessageAt để đảm bảo thứ tự đúng
        state.conversations.sort((a, b) => {
          const timeA = new Date(a.lastMessageAt).getTime();
          const timeB = new Date(b.lastMessageAt).getTime();
          return timeB - timeA; // Mới nhất lên đầu
        });
        
        // Tự động chọn conversation đầu tiên nếu chưa có conversation được chọn
        if (state.conversations.length > 0 && !state.currentConversationId) {
          state.currentConversationId = state.conversations[0]._id;
        } else if (state.conversations.length === 0) {
          // Nếu không có conversation nào, set loadingMessages = false để không hiển thị loading
          state.loadingMessages = false;
          state.currentConversationId = null;
          state.messages = [];
        }
        state.error = null;
      })
      .addCase(loadConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload as string;
      });

    // Create conversation
    builder
      .addCase(createConversation.fulfilled, (state, action: PayloadAction<ConversationResponse>) => {
        // Kiểm tra xem conversation đã tồn tại trong list chưa để tránh duplicate
        const existingIndex = state.conversations.findIndex(
          (conv) => conv._id === action.payload._id
        );
        
        if (existingIndex === -1) {
          // Thêm conversation mới vào đầu danh sách nếu chưa tồn tại
          state.conversations = [action.payload, ...state.conversations];
        } else {
          // Nếu đã tồn tại, di chuyển nó lên đầu danh sách
          const existing = state.conversations[existingIndex];
          state.conversations = [
            existing,
            ...state.conversations.slice(0, existingIndex),
            ...state.conversations.slice(existingIndex + 1),
          ];
        }
        
        // Tự động chọn conversation vừa tạo
        state.currentConversationId = action.payload._id;
        state.messages = [];
        state.error = null;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update conversation title
    builder.addCase(
      updateConversationTitle.fulfilled,
      (state, action: PayloadAction<ConversationResponse>) => {
        const updatedConversation = action.payload;
        const index = state.conversations.findIndex(
          (conv) => conv._id === updatedConversation._id
        );

        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            ...updatedConversation,
          };

          // Sắp xếp lại theo lastMessageAt để đảm bảo thứ tự đúng
          state.conversations.sort((a, b) => {
            const timeA = new Date(a.lastMessageAt).getTime();
            const timeB = new Date(b.lastMessageAt).getTime();
            return timeB - timeA; // Mới nhất lên đầu
          });
        }

        // Nếu conversation được cập nhật đang được chọn, đảm bảo title được sync
        if (state.currentConversationId === updatedConversation._id) {
          // Không cần làm gì thêm vì title được lấy từ conversations
        }

        state.error = null;
      }
    );

    // Load messages
    builder
      .addCase(loadMessages.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action: PayloadAction<MessageResponse[]>) => {
        state.loadingMessages = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<MessageResponse>) => {
        state.loading = false;
        // Thêm message mới vào đầu danh sách
        state.messages = [action.payload, ...state.messages];
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete conversation
    builder
      .addCase(deleteConversation.pending, (state) => {
          state.error = null;
          state.loadingConversations = true;
        })
      .addCase(deleteConversation.fulfilled, (state, action: PayloadAction<string>) => {
        state.loadingConversations = false;

        // Loại bỏ conversation khỏi danh sách
        const deletedConversationId = action.payload;
        state.conversations = state.conversations.filter(
          (conv) => conv._id !== deletedConversationId
        );

        // Nếu conversation bị xóa đang được chọn, clear currentConversationId và messages
        if (state.currentConversationId === deletedConversationId) {
          state.currentConversationId = state.conversations.length > 0 ? state.conversations[0]._id : null;
          state.messages = [];
        }

        state.error = null;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload as string;
      });
      
  },
});

export const { setCurrentConversationId, clearMessages, clearError, resetState } = knowledgeLibSlice.actions;
export default knowledgeLibSlice.reducer;
