import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Settings = () => {
  const { theme, changeTheme } = useTheme();
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
    language: 'en',
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
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
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
              <h3 className="text-gray-900 dark:text-white font-medium">Push Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications</p>
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
              <h3 className="text-gray-900 dark:text-white font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</p>
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-300 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 dark:text-white font-medium">Show Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Display your email on your profile</p>
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
              <h3 className="text-gray-900 dark:text-white font-medium">Show Phone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Display your phone number on your profile</p>
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => changeTheme(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-300 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSelect('language', 'language', e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-300 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-red-500/50 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

