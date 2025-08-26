import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('home.welcome')}</h1>
        <p>{t('home.description')}</p>
        <div style={{ marginTop: '2rem' }}>
          <h2>{t('home.features.title')}</h2>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li>• {t('home.features.auth')}</li>
            <li>• {t('home.features.management')}</li>
            <li>• {t('home.features.reports')}</li>
            <li>• {t('home.features.security')}</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Home;


