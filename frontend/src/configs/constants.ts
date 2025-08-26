// Constants chung cho ứng dụng
export const CONSTANTS = {
  // HTTP Status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator',
    GUEST: 'guest',
  },
  
  // User status
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending',
  },
  
  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'dd/MM/yyyy',
    API: 'yyyy-MM-dd',
    DATETIME: 'dd/MM/yyyy HH:mm',
    TIME: 'HH:mm',
  },
  
  // File upload
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_SIZE: 10,
    MAX_SIZE: 100,
  },
  
  // Validation messages
  VALIDATION_MESSAGES: {
    REQUIRED: 'Trường này là bắt buộc',
    EMAIL: 'Email không hợp lệ',
    MIN_LENGTH: 'Tối thiểu {min} ký tự',
    MAX_LENGTH: 'Tối đa {max} ký tự',
    PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    SERVER_ERROR: 'Lỗi máy chủ',
    UNAUTHORIZED: 'Bạn không có quyền truy cập',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
    DELETE_FAILED: 'Xóa thất bại',
    UPDATE_FAILED: 'Cập nhật thất bại',
    CREATE_FAILED: 'Tạo thất bại',
    FETCH_FAILED: 'Lấy dữ liệu thất bại',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    SAVE: 'Lưu thành công',
    DELETE: 'Xóa thành công',
    UPDATE: 'Cập nhật thành công',
    CREATE: 'Tạo thành công',
    LOGIN: 'Đăng nhập thành công',
    LOGOUT: 'Đăng xuất thành công',
  },
} as const;

// Type cho user roles
export type UserRole = typeof CONSTANTS.USER_ROLES[keyof typeof CONSTANTS.USER_ROLES];

// Type cho user status
export type UserStatus = typeof CONSTANTS.USER_STATUS[keyof typeof CONSTANTS.USER_STATUS];
