import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { getLocalizedPath } = useTranslation();

  // Hiển thị loading spinner khi đang kiểm tra authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect về login nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={getLocalizedPath('/login')} replace />;
  }

  return children;
};

export default ProtectedRoute;
