import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { changeLanguage } from '../store/slices/languageSlice';
import { useLocation } from 'react-router-dom';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);

  useEffect(() => {
    const path = location.pathname;
    
    // Xác định ngôn ngữ từ URL
    let urlLanguage: 'vi' | 'en' = 'vi';
    if (path.startsWith('/en/') || path === '/en') {
      urlLanguage = 'en';
    }
    
    // Nếu ngôn ngữ từ URL khác với ngôn ngữ hiện tại, cập nhật
    if (urlLanguage !== currentLanguage) {
      dispatch(changeLanguage(urlLanguage));
    }
  }, [location.pathname, currentLanguage, dispatch]);

  return <>{children}</>;
};

export default LanguageProvider;
