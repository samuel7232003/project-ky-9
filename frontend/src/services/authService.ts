import { apiInstance, isAuthenticated } from './api';

// Interface cho login request
export interface LoginRequest {
  username: string;
  password: string;
}

// Interface cho register request
export interface RegisterRequest {
  username: string;
  password: string;
}

// Interface cho user response
export interface UserResponse {
  id: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho auth response
export interface AuthResponse {
  user: UserResponse;
}

// Service cho authentication
export const authService = {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiInstance.post<AuthResponse>('/auth/login', credentials);
    // Token được lưu trong HTTP-only cookie bởi backend
    return response.data;
  },

  // Đăng ký
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiInstance.post<AuthResponse>('/auth/register', userData);
    // Token được lưu trong HTTP-only cookie bởi backend
    return response.data;
  },

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await apiInstance.post('/auth/logout');
      // Cookie sẽ được xóa bởi backend
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser(): Promise<UserResponse> {
    const response = await apiInstance.get<UserResponse>('/auth/me');
    return response.data;
  },

  // Kiểm tra token có hợp lệ không
  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Kiểm tra user đã đăng nhập chưa
  isAuthenticated(): boolean {
    return isAuthenticated();
  },
};
