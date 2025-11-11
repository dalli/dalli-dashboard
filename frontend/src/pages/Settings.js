import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { theme, changeTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
    },
  });

  const handleToggle = (category, key) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: !settings[category][key],
      },
    });
  };

  const handleSelect = (category, key, value) => {
    if (category === 'language' && key === 'language') {
      changeLanguage(value);
    } else {
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value,
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('settings.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('settings.description')}</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('settings.notificationSettings')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">{t('settings.emailNotifications')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.emailNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">{t('settings.pushNotifications')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.pushNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">{t('settings.smsNotifications')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.smsNotificationsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={() => handleToggle('notifications', 'sms')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('settings.privacySettings')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.profileVisibility')}</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-300 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">{t('settings.public')}</option>
              <option value="private">{t('settings.private')}</option>
              <option value="friends">{t('settings.friendsOnly')}</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">{t('settings.showEmail')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.showEmailDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.showEmail}
                onChange={() => handleToggle('privacy', 'showEmail')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">{t('settings.showPhone')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.showPhoneDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.showPhone}
                onChange={() => handleToggle('privacy', 'showPhone')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('settings.appearance')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.theme')}</label>
            <select
              value={theme}
              onChange={(e) => changeTheme(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-300 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dark">{t('settings.dark')}</option>
              <option value="light">{t('settings.light')}</option>
              <option value="auto">{t('settings.auto')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.language')}</label>
            <select
              value={language}
              onChange={(e) => handleSelect('language', 'language', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-300 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">{t('settings.english')}</option>
              <option value="ko">{t('settings.korean')}</option>
              <option value="ja">{t('settings.japanese')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-red-500/50 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('settings.dangerZone')}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">{t('settings.deleteAccount')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('settings.deleteAccountDesc')}</p>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              {t('settings.deleteAccountButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

