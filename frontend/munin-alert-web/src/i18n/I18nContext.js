import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import en from './translations/en.json';
import no from './translations/no.json';

const dictionaries = { en, no };
const defaultLang = (typeof navigator !== 'undefined' && navigator.language?.startsWith('no')) ? 'no' : 'en';
const stored = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null;

const I18nContext = createContext({
  lang: 'en',
  t: (key, vars) => key,
  setLang: () => {},
});

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(stored || defaultLang);

  useEffect(() => {
    try { window.localStorage.setItem('lang', lang); } catch (_) {}
  }, [lang]);

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    return (key, vars) => {
      const template = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), dict);
      let str = (template ?? key);
      if (vars && typeof str === 'string') {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return str;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
