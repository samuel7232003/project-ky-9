import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APP_CONFIG } from '../configs';

// Tạo API instance với axios
const apiInstance: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.api.baseURL,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  // Bật credentials để gửi cookie với mọi request
  withCredentials: true,
});

// Response interceptor để xử lý lỗi
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Không tự động redirect trong interceptor để tránh vòng lặp
    // Việc xử lý redirect sẽ được thực hiện trong components
    return Promise.reject(error);
  }
);

// Hàm xử lý response
export const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Hàm xử lý error
export const handleError = (error: any): never => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message || 'Có lỗi xảy ra');
};

// Export API instance
export { apiInstance };

// Hàm kiểm tra user đã đăng nhập chưa (dựa trên việc có cookie hay không)
export const isAuthenticated = (): boolean => {
  // Kiểm tra xem có cookie token hay không
  return document.cookie.includes('token=');
};

// Hàm xóa cookie (thường được gọi khi logout)
export const clearAuthCookie = () => {
  // Cookie sẽ được xóa bởi backend khi gọi logout endpoint
  // Frontend chỉ cần redirect về login page
};

// Export các method HTTP cơ bản
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiInstance.get<T>(url, config).then(handleResponse).catch(handleError),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiInstance.post<T>(url, data, config).then(handleResponse).catch(handleError),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiInstance.put<T>(url, data, config).then(handleResponse).catch(handleError),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiInstance.delete<T>(url, config).then(handleResponse).catch(handleError),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiInstance.patch<T>(url, data, config).then(handleResponse).catch(handleError),
};
