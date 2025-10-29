import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setFormData,
  setRegisterData,
  clearError,
  clearFieldErrors,
} from './Login.duck';
import { loginUser, registerUser } from '../../store/slices/authSlice';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './Login.module.css';
import { RootState } from '../../store/store';

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, getLocalizedPath } = useTranslation();
  
  // Selectors
  const { formData, registerData, isRegister, loading, error, fieldErrors } = useAppSelector((state: RootState) => state.login);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (isRegister) {
      dispatch(setRegisterData({ field: name as keyof typeof registerData, value }));
    } else {
      dispatch(setFormData({ field: name as keyof typeof formData, value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(clearFieldErrors());

    if (isRegister) {
      try {
        const { username, password } = registerData;
        await dispatch(registerUser({ username, password })).unwrap();
        navigate(getLocalizedPath('/'));
      } catch (error) {
        // Error đã được xử lý trong Redux
      }
    } else {
      try {
        await dispatch(loginUser(formData)).unwrap();
        navigate(getLocalizedPath('/'));
      } catch (error) {
        // Error đã được xử lý trong Redux
      }
    }
  };

  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>
          {isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
        </h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {t(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister ? (
            <>
              <div className={styles.formGroup}>
                {/* <label htmlFor="username" className={styles.label}>
                  {t('auth.register.username')}:
                </label> */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={registerData.username}
                    onChange={handleInputChange}
                    placeholder='Tên người dùng'
                    className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
                    required
                  />
                  {/* <Icon 
                    name="user" 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }} 
                  /> */}
                </div>
                {fieldErrors.username && (
                  <div className={styles.fieldError}>{t(fieldErrors.username)}</div>
                )}
              </div>
              
              {/* <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  {t('auth.register.email')}:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                    required
                  />
                  <Icon 
                    name="email" 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }} 
                  />
                </div>
                {fieldErrors.email && (
                  <div className={styles.fieldError}>{t(fieldErrors.email)}</div>
                )}
              </div> */}
              
              <div className={styles.formGroup}>
                {/* <label htmlFor="password" className={styles.label}>
                  {t('auth.register.password')}:
                </label> */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleInputChange}
                    placeholder='Mật khẩu'
                    className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                    required
                  />
                  {/* <Icon 
                    name="lock" 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }} 
                  /> */}
                </div>
                {fieldErrors.password && (
                  <div className={styles.fieldError}>{t(fieldErrors.password)}</div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                {/* <label htmlFor="confirmPassword" className={styles.label}>
                  {t('auth.register.confirmPassword')}:
                </label> */}
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder='Xác nhận mật khẩu'
                  className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}
                  required
                />
                {fieldErrors.confirmPassword && (
                  <div className={styles.fieldError}>{t(fieldErrors.confirmPassword)}</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                {/* <label htmlFor="username" className={styles.label}>
                  {t('auth.login.username')}:
                </label> */}
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  placeholder='Tên người dùng'
                />
              </div>
              
              <div className={styles.formGroup}>
                {/* <label htmlFor="password" className={styles.label}>
                  {t('auth.login.password')}:
                </label> */}
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  placeholder='Mật khẩu'
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className={styles.submitBtn}
          >
            {loading ? t('auth.login.processing') : (isRegister ? t('auth.register.submit') : t('auth.login.submit'))}
          </button>
        </form>

        {/* <div className={styles.toggleForm}>
          <button
            type="button"
            onClick={handleToggleMode}
            className={styles.toggleBtn}
          >
            {isRegister ? t('auth.login.noAccount') : t('auth.register.hasAccount')}
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Login;


