import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem'
    }}>
      {message || t('common.loading')}
    </div>
  );
};

export default LoadingSpinner;
