import { apiInstance } from './api';
import { UserResponse } from './authService';

// Interface cho user filters
export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Interface cho user list response
export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface cho create user request
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// Interface cho update user request
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: string;
  status?: string;
}

// Service cho user management
export const userService = {
  // Lấy danh sách users
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiInstance.get<UserListResponse>(`/users?${params.toString()}`);
    return response.data;
  },

  // Lấy thông tin user theo ID
  async getUserById(id: string): Promise<UserResponse> {
    const response = await apiInstance.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  // Tạo user mới
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    const response = await apiInstance.post<UserResponse>('/users', userData);
    return response.data;
  },

  // Cập nhật user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiInstance.put<UserResponse>(`/users/${id}`, userData);
    return response.data;
  },

  // Xóa user
  async deleteUser(id: string): Promise<void> {
    await apiInstance.delete(`/users/${id}`);
  },

  // Cập nhật profile của user hiện tại
  async updateProfile(userData: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiInstance.put<UserResponse>('/users/profile', userData);
    return response.data;
  },

  // Đổi mật khẩu
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiInstance.put('/users/change-password', { currentPassword, newPassword });
  },
};
