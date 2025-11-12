import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const toggle = () => setLang(lang === 'en' ? 'no' : 'en');

  return (
    <button className="lang-switcher" onClick={toggle} aria-label="Toggle language">
      {lang === 'en' ? 'NO' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;
