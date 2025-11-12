import React from 'react';
import './SettingsPage.css';
import ListTile from '../../components/Shared/ListTile';
import LogoBlock from '../../components/Shared/LogoBlock';

/**
 * SettingsPage
 * Initial scaffold matching mobile design mockup.
 * Tiles only – navigation and functionality wired later.
 */
const settingsItems = [
  { key: 'account', i18n: 'settings.tiles.account', fallback: 'Account', icon: '👤' },
  { key: 'groups', i18n: 'settings.tiles.groups', fallback: 'Groups', icon: '👥' },
  { key: 'safehavens', i18n: 'settings.tiles.safehavens', fallback: 'Safe Havens', icon: '✅' },
  { key: 'alarm', i18n: 'settings.tiles.alarm', fallback: 'Alarm Activation', icon: '⚠️' },
  { key: 'language', i18n: 'settings.tiles.language', fallback: 'Language', icon: '🌐' },
  { key: 'help', i18n: 'settings.tiles.help', fallback: 'Help', icon: '❓' }
];

import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';

function SettingsPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();

  const handleTileClick = (key) => {
    switch (key) {
      case 'account':
        navigate('/profile');
        break;
      case 'groups':
        navigate('/groups');
        break;
      case 'safehavens':
        navigate('/map', { state: { filter: 'safe-havens' } });
        break;
      case 'alarm':
        navigate('/alarm');
        break;
      case 'language':
        // Toggle language EN <-> NO as a quick action; later can open dedicated panel
        setLang(lang === 'en' ? 'no' : 'en');
        break;
      case 'help':
        navigate('/about');
        break;
      default:
        break;
    }
  };

  return (
    <div className="settings-wrapper">
      <h1 className="settings-title">{t('settings.title') || 'Settings'}</h1>
      <div className="settings-list">
        {settingsItems.map(item => (
          <ListTile
            key={item.key}
            icon={item.icon}
            label={t(item.i18n) || item.fallback}
            onClick={() => handleTileClick(item.key)}
          />
        ))}
      </div>

      {/* Language selector section */}
      <section className="settings-language" aria-labelledby="lang-title" style={{ marginTop: '2rem' }}>
        <h2 id="lang-title">{t('settings.language.title')}</h2>
        <p>{t('settings.language.description')}</p>
        <label htmlFor="language-select">{t('settings.language.label')}</label>
        <select
          id="language-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label={t('settings.language.label')}
        >
          <option value="en">{t('settings.language.options.en')}</option>
          <option value="no">{t('settings.language.options.no')}</option>
        </select>
      </section>

      <LogoBlock />
    </div>
  );
}

export default SettingsPage;
