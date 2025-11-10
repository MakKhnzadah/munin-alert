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
  { key: 'account', label: 'Account', icon: '👤' },
  { key: 'groups', label: 'Groups', icon: '👥' },
  { key: 'safehavens', label: 'Safehavens', icon: '✅' },
  { key: 'alarm', label: 'Alarm Activation', icon: '⚠️' },
  { key: 'language', label: 'Language', icon: '🌐' },
  { key: 'help', label: 'Help', icon: '❓' }
];

function SettingsPage() {
  return (
    <div className="settings-wrapper">
      <h1 className="settings-title">Settings</h1>
      <div className="settings-list">
        {settingsItems.map(item => (
          <ListTile key={item.key} icon={item.icon} label={item.label} />
        ))}
      </div>
      <LogoBlock />
    </div>
  );
}

export default SettingsPage;
