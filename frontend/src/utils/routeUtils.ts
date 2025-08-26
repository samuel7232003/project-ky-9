import React from 'react';

// Type cho route configuration
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  children?: RouteConfig[];
}

// Type cho localized route
export interface LocalizedRoute {
  path: string;
  element: React.ReactElement;
  children?: LocalizedRoute[];
}

/**
 * Tạo routes tự động cho đa ngôn ngữ
 * @param routes - Mảng các route cần tạo
 * @param languages - Mảng các ngôn ngữ hỗ trợ
 * @returns Mảng routes đã được localize
 */
export const createLocalizedRoutes = (
  routes: RouteConfig[],
  languages: readonly string[] = ['vi', 'en']
): LocalizedRoute[] => {
  const localizedRoutes: LocalizedRoute[] = [];

  routes.forEach((route) => {
    languages.forEach((lang) => {
      // Tạo path cho từng ngôn ngữ
      let localizedPath: string;
      
      if (lang === 'vi') {
        // Tiếng Việt không có prefix
        localizedPath = route.path;
      } else {
        // Các ngôn ngữ khác có prefix
        if (route.path === '/') {
          localizedPath = `/${lang}`;
        } else {
          localizedPath = `/${lang}${route.path}`;
        }
      }
      
      const localizedRoute: LocalizedRoute = {
        path: localizedPath,
        element: route.element,
        children: route.children ? createLocalizedRoutes(route.children, languages) : undefined,
      };
      
      localizedRoutes.push(localizedRoute);
    });
  });

  return localizedRoutes;
};

/**
 * Tạo routes với redirect tự động
 * @param routes - Mảng các route cần tạo
 * @param languages - Mảng các ngôn ngữ hỗ trợ
 * @returns Mảng routes với redirect
 */
export const createRoutesWithRedirects = (
  routes: RouteConfig[],
  languages: readonly string[] = ['vi', 'en']
): LocalizedRoute[] => {
  const localizedRoutes = createLocalizedRoutes(routes, languages);
  
  // Thêm redirect routes
  const redirectRoutes: LocalizedRoute[] = [];
  
  routes.forEach((route) => {
    // Redirect từ root path đến ngôn ngữ mặc định (vi)
    if (route.path === '/') {
      redirectRoutes.push({
        path: '/',
        element: route.element,
      });
    }
  });
  
  return [...redirectRoutes, ...localizedRoutes];
};
