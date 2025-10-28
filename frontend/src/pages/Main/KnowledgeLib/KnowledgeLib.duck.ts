import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  chats: [] as Array<any>,
  currentChatId: null as string | null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    newChat: (state) => {
      const id = nanoid();
      const newChat = {
        id,
        title: 'Trò chuyện mới',
        createdAt: new Date().toISOString(),
        messages: [],
      };
      state.chats.push(newChat);
      state.currentChatId = id;
    },
    selectChat: (state, action) => {
      state.currentChatId = action.payload;
    },
    addMessage: (state, action) => {
      const { role, content } = action.payload;
      const chat = state.chats.find(c => c.id === state.currentChatId);
      if (chat) {
        chat.messages.push({
          id: nanoid(),
          role,
          content,
          timestamp: new Date().toISOString(),
        });
      }
    },
  },
});

export const { newChat, selectChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
