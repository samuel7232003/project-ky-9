import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APP_CONFIG } from '../../configs';

export type Language = 'vi' | 'en';

interface LanguageState {
  currentLanguage: Language;
}

// Đọc ngôn ngữ từ localStorage hoặc URL khi khởi tạo
const getInitialLanguage = (): Language => {
  // Kiểm tra URL trước
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.startsWith('/en/') || path === '/en') {
      return 'en';
    }
  }
  
  // Nếu không có trong URL, kiểm tra localStorage
  const savedLanguage = localStorage.getItem(APP_CONFIG.storage.language) as Language;
  return savedLanguage && APP_CONFIG.languages.supported.includes(savedLanguage as any) 
    ? savedLanguage 
    : APP_CONFIG.languages.default;
};

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      // Lưu vào localStorage
      localStorage.setItem(APP_CONFIG.storage.language, action.payload);
    },
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
