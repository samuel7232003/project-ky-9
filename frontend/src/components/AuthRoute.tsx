import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

interface AuthRouteProps {
  children: React.ReactElement;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { getLocalizedPath } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to={getLocalizedPath('/')} replace />;
  }

  return children;
};

export default AuthRoute;
