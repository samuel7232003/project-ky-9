import React from 'react';
import './App.css';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header1 from './components/Header/Header1';
import LanguageProvider from './components/LanguageProvider';
import LocalizedRoutes from './components/LocalizedRoutes';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import AuthRoute from './components/AuthRoute';
import { RouteConfig } from './utils/routeUtils';
import { APP_CONFIG } from './configs';
import { useTranslation } from './hooks/useTranslation';

// Component để redirect đến trang drone
function RedirectToDrone() {
  const { getLocalizedPath } = useTranslation();
  return <Navigate to={getLocalizedPath('/main/drone')} replace />;
}

// Component con để sử dụng useTranslation khi đã có Router context
function AppContent() {
  // Định nghĩa routes một lần duy nhất
  const appRoutes: RouteConfig[] = [
    {
      path: '/',
      element: <RedirectToDrone />,
    },
    {
      path: '/login',
      element: (
        <AuthRoute>
          <Login />
        </AuthRoute>
      ),
    },
    {
      path: '/main/*',
      element: <Main />,
    }
  ];

  return (
    <LanguageProvider>
      <div className="App">
        {/* <Header /> */}
        <Header1 />
        <LocalizedRoutes 
          routes={appRoutes}
          languages={APP_CONFIG.languages.supported}
          defaultLanguage={APP_CONFIG.languages.default}
        />
      </div>
    </LanguageProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Component wrapper để sử dụng useAuth
function AppWrapper() {
  const { loading } = useAuth();

  // Hiển thị loading spinner khi đang kiểm tra authentication
  // Điều này đảm bảo không redirect về home khi reload trang
  if (loading) {
    return (
      <LanguageProvider>
        <LoadingSpinner />
      </LanguageProvider>
    );
  }

  return <AppContent />;
}

export default App;
