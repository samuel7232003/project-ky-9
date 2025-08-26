import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { useTranslation } from '../../hooks/useTranslation';
import { Icon } from '../Icon';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { t, currentLanguage, changeLanguage, getAvailableLanguages, getLocalizedPath } = useTranslation();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as 'vi' | 'en';
    changeLanguage(newLanguage);
  };

  const availableLanguages = getAvailableLanguages();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to={getLocalizedPath('/')}>
            <Icon name="home" size={20} style={{ marginRight: '8px' }} />
            {t('header.brand')}
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <Link to={getLocalizedPath('/')} className={styles.navLink}>
            <Icon name="home" size={16} style={{ marginRight: '4px' }} />
            {t('navigation.home')}
          </Link>
          {!isAuthenticated && (
            <Link to={getLocalizedPath('/login')} className={styles.navLink}>
              <Icon name="login" size={16} style={{ marginRight: '4px' }} />
              {t('navigation.login')}
            </Link>
          )}
        </nav>

        <div className={styles.userInfo}>
          {/* Language Selector */}
          <div className={styles.languageSelector}>
            <select 
              value={currentLanguage} 
              onChange={handleLanguageChange}
              className={styles.languageSelect}
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {isAuthenticated ? (
            <div className={styles.userSection}>
              <span className={styles.username}>{t('header.welcome', { username: user?.username || '' })}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <Icon name="logout" size={16} style={{ marginRight: '4px' }} />
                {t('navigation.logout')}
              </button>
            </div>
          ) : (
            <span className={styles.guest}>{t('header.guest')}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
