import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentUser } from '../store/slices/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Chỉ kiểm tra authentication một lần duy nhất khi app khởi động
    // và chỉ khi chưa có thông tin user và chưa có lỗi UNAUTHORIZED
    if (!hasCheckedAuth.current && !user && !isAuthenticated && error !== 'UNAUTHORIZED') {
      hasCheckedAuth.current = true;
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isAuthenticated, error]);

  // Reset hasCheckedAuth khi user đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated && user) {
      hasCheckedAuth.current = false;
    }
  }, [isAuthenticated, user]);

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
