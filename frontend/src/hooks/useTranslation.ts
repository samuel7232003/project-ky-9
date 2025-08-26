import { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { changeLanguage } from '../store/slices/languageSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import viTranslations from '../translations/vi.json';
import enTranslations from '../translations/en.json';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

// Type cho translation object
type TranslationObject = typeof viTranslations;

// Hook để quản lý translation
export const useTranslation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  
  const translations = useMemo(() => {
    switch (currentLanguage) {
      case 'en':
        return enTranslations;
      case 'vi':
      default:
        return viTranslations;
    }
  }, [currentLanguage]);

  // Hàm để lấy translation text
  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    // Traverse theo key path
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Trả về key nếu không tìm thấy translation
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Nếu value là string, thay thế params
    if (typeof value === 'string') {
      if (params) {
        return Object.keys(params).reduce((str, paramKey) => {
          return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
        }, value);
      }
      return value;
    }
    
    // Trả về key nếu value không phải string
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  };

  // Hàm để lấy translation object (cho các trường hợp cần object)
  const getTranslation = (key: TranslationKey): any => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return value;
  };

  // Hàm để lấy prefix URL cho ngôn ngữ hiện tại
  const getLanguagePrefix = useCallback((language?: 'vi' | 'en'): string => {
    const lang = language || currentLanguage;
    return lang === 'en' ? '/en' : '';
  }, [currentLanguage]);

  // Hàm để chuyển đổi URL khi thay đổi ngôn ngữ
  const getLocalizedPath = useCallback((path: string, language?: 'vi' | 'en'): string => {
    const lang = language || currentLanguage;
    const prefix = getLanguagePrefix(lang);
    
    // Loại bỏ prefix hiện tại nếu có
    let cleanPath = path;
    if (path.startsWith('/en/')) {
      cleanPath = path.substring(3);
    } else if (path === '/en') {
      cleanPath = '/';
    }
    
    // Thêm prefix mới nếu cần
    return prefix + cleanPath;
  }, [currentLanguage, getLanguagePrefix]);

  // Hàm để thay đổi ngôn ngữ
  const changeLanguageHandler = useCallback((language: 'vi' | 'en') => {
    dispatch(changeLanguage(language));
    
    // Cập nhật URL khi thay đổi ngôn ngữ
    const newPath = getLocalizedPath(location.pathname, language);
    if (newPath !== location.pathname) {
      navigate(newPath);
    }
  }, [dispatch, location.pathname, navigate, getLocalizedPath]);

  // Hàm để lấy danh sách ngôn ngữ có sẵn
  const getAvailableLanguages = useCallback(() => {
    return [
      { code: 'vi', name: 'Tiếng Việt' },
      { code: 'en', name: 'English' }
    ];
  }, []);

  return {
    t,
    getTranslation,
    currentLanguage,
    changeLanguage: changeLanguageHandler,
    getAvailableLanguages,
    getLanguagePrefix,
    getLocalizedPath,
  };
};

// Type helper cho translation keys
export type TranslationKeys = {
  [K in keyof TranslationObject]: TranslationObject[K] extends string
    ? K
    : TranslationObject[K] extends Record<string, any>
    ? { [P in keyof TranslationObject[K]]: `${K}.${P & string}` }[keyof TranslationObject[K]]
    : never;
}[keyof TranslationObject];
