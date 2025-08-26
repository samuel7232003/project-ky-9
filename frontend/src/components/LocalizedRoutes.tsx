import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RouteConfig, createLocalizedRoutes } from '../utils/routeUtils';

interface LocalizedRoutesProps {
  routes: RouteConfig[];
  languages?: readonly string[];
  defaultLanguage?: string;
}

const LocalizedRoutes: React.FC<LocalizedRoutesProps> = ({
  routes,
  languages = ['vi', 'en'],
  defaultLanguage = 'vi'
}) => {
  // Tạo routes tự động cho đa ngôn ngữ
  const localizedRoutes = createLocalizedRoutes(routes, languages);
  
  return (
    <Routes>
      {/* Localized routes */}
      {localizedRoutes.map((localizedRoute) => (
        <Route
          key={localizedRoute.path}
          path={localizedRoute.path}
          element={localizedRoute.element}
        />
      ))}
      
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default LocalizedRoutes;
