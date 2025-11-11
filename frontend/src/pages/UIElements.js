import React, { useState } from 'react';

const UIElements = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">UI Elements</h1>
        <p className="text-gray-600 dark:text-gray-400">Explore various UI components and elements.</p>
      </div>

      {/* Buttons */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-lg transition-colors">
            Primary
          </button>
          <button className="px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] hover:bg-gray-100 dark:hover:bg-[#3a3f4a] text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-200 dark:border-[#3a3f4a]">
            Secondary
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white rounded-lg transition-colors">
            Success
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white rounded-lg transition-colors">
            Danger
          </button>
          <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-gray-900 dark:text-white rounded-lg transition-colors">
            Warning
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-gray-900 dark:text-white rounded-lg transition-colors">
            Info
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-[#1a1f28] rounded-lg p-4 border border-gray-200 dark:border-[#3a3f4a]">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Card Title</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">This is a simple card component with some content.</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1f28] rounded-lg p-4 border border-gray-200 dark:border-[#3a3f4a]">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Card Title</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">This is a simple card component with some content.</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#1a1f28] rounded-lg p-4 border border-gray-200 dark:border-[#3a3f4a]">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Card Title</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">This is a simple card component with some content.</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Alerts</h2>
        <div className="space-y-3">
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-blue-400">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
              </svg>
              <p className="text-blue-400">This is an info alert message.</p>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-green-400">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
              </svg>
              <p className="text-green-400">This is a success alert message.</p>
            </div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-yellow-400">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
              </svg>
              <p className="text-yellow-400">This is a warning alert message.</p>
            </div>
          </div>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-red-400">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"></path>
              </svg>
              <p className="text-red-400">This is an error alert message.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Primary</span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Success</span>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Warning</span>
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Danger</span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Info</span>
          <span className="px-3 py-1 bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded-full text-sm">Default</span>
        </div>
      </div>

      {/* Modals */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Modal</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-lg transition-colors"
        >
          Open Modal
        </button>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
            <div
              className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Modal Title</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">This is a modal dialog. Click outside to close.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] hover:bg-gray-100 dark:hover:bg-[#3a3f4a] text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-200 dark:border-[#3a3f4a]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIElements;

