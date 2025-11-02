// Cấu hình chung cho ứng dụng
export const APP_CONFIG = {
  // Cấu hình ngôn ngữ
  languages: {
    supported: ['vi', 'en'] as const,
    default: 'vi' as const,
  },
  
  // Cấu hình API
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  
  // Cấu hình localStorage keys (chỉ cho language và user data)
  storage: {
    language: 'preferredLanguage',
    user: 'user_data',
  },
  
  // Cấu hình pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
  
  // Cấu hình validation
  validation: {
    username: {
      minLength: 3,
      maxLength: 20,
    },
    password: {
      minLength: 6,
      maxLength: 50,
    },
  },
  
  // Cấu hình theme
  theme: {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    borderRadius: '6px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
} as const;

// Type cho ngôn ngữ
export type SupportedLanguage = typeof APP_CONFIG.languages.supported[number];

// Type cho cấu hình ứng dụng
export type AppConfig = typeof APP_CONFIG;
