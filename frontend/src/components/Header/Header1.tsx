import React from "react";
import css from "./Header1.module.css";
import { Link } from "react-router-dom";
import {
  toggleLoginMode,
  toggleRegisterMode
} from '../../pages/Login/Login.duck';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/slices/authSlice";
import { useTranslation } from "../../hooks/useTranslation";

const Header1: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const handleRouteLogin = () => {
    dispatch(toggleLoginMode());
  }

  const handleRouteRegister = () => {
    dispatch(toggleRegisterMode());
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  }

  return (
    <header>
      <div className={css.container}>
        <div className={css.containerLeft}>
          <Link className={css.main} to={('/')} aria-label={t('navigation.home')}>
            {t('navigation.home')}
          </Link>
          <Link className={css.infor} to={('/')} aria-label={t('navigation.about')}>
            {t('navigation.about')}
          </Link>
        </div>
        <div className={css.containerRight}>
          {isAuthenticated ? (
            <button
              type="button"
              className={css.login}
              onClick={handleLogout}
              aria-label={t('navigation.logout')}
            >
              {t('navigation.logout')}
            </button>
          ) : (
            <>
              <Link to={('/login')} onClick={handleRouteLogin} aria-label={t('navigation.login')}>
                <button
                  type="button"
                  className={css.login}
                  aria-label={t('navigation.login')}
                >
                  {t('navigation.login')}
                </button>
              </Link>
              <Link
                className={css.register}
                to={('/login')}
                onClick={handleRouteRegister}
                aria-label={t('navigation.register')}
              >
                {t('navigation.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header1;