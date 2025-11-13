import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ onMenuClick }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white dark:bg-[#111318] border-b border-gray-200 dark:border-[#282e39] transition-colors">
      <div className="flex flex-grow items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#282e39] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-gray-500 dark:text-[#9da6b9]">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
            <input
              type="text"
              placeholder={t('common.search')}
              className="bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#9da6b9] w-48"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-gray-600 dark:text-[#9da6b9] hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M220.8,175.94C216.34,163.38,200,138.46,200,104a72,72,0,0,0-144,0c0,34.46-16.34,59.38-20.8,71.94A16,16,0,0,0,48,200H88a40,40,0,0,0,80,0h40a16,16,0,0,0,12.8-24.06ZM128,224a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,224ZM48,184c4.55-12.56,16-39.22,16-80a56,56,0,0,1,112,0c0,40.78,11.45,67.44,16,80Z"></path>
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#282e39] rounded-lg shadow-lg border border-gray-200 dark:border-[#3a3f4a] p-4 transition-colors">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{t('common.notifications')}</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3f4a] rounded cursor-pointer transition-colors">
                    {t('header.newMessageReceived')}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3f4a] rounded cursor-pointer transition-colors">
                    {t('header.orderShipped')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

