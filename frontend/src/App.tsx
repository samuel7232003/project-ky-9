import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Header1 from './components/Header/Header1';
import LanguageProvider from './components/LanguageProvider';
import LocalizedRoutes from './components/LocalizedRoutes';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import AuthRoute from './components/AuthRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { RouteConfig } from './utils/routeUtils';
import { APP_CONFIG } from './configs';

// Component con để sử dụng useTranslation khi đã có Router context
function AppContent() {
  
  // Định nghĩa routes một lần duy nhất
  const appRoutes: RouteConfig[] = [
    {
      path: '/',
      element: <Home />,
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
      element: (
        <ProtectedRoute>
          <Main />
        </ProtectedRoute>
      ),
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
  const { loading, isAuthenticated } = useAuth();

  // Chỉ hiển thị loading spinner khi đang kiểm tra authentication lần đầu
  // và chưa có thông tin về authentication status
  if (loading && isAuthenticated === false) {
    return (
      <LanguageProvider>
        <LoadingSpinner />
      </LanguageProvider>
    );
  }

  return <AppContent />;
}

export default App;
