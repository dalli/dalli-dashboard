import React from 'react';
import HomeHeader from '../components/HomeHeader';

const Docs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111318]">
      <HomeHeader />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Documentation</h1>
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#282e39] p-6 rounded-lg border border-gray-200 dark:border-[#3a3f4a]">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Welcome to DalliAdmin documentation. This is a sample documentation page.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Installation guide</li>
              <li>Configuration options</li>
              <li>Basic usage examples</li>
            </ul>
          </section>
          <section className="bg-white dark:bg-[#282e39] p-6 rounded-lg border border-gray-200 dark:border-[#3a3f4a]">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">API Reference</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Complete API reference for DalliAdmin.
            </p>
            <div className="bg-gray-100 dark:bg-[#1a1f28] p-4 rounded-lg">
              <code className="text-sm text-gray-900 dark:text-white">
                GET /api/v1/dashboard
              </code>
            </div>
          </section>
          <section className="bg-white dark:bg-[#282e39] p-6 rounded-lg border border-gray-200 dark:border-[#3a3f4a]">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Guides</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Step-by-step guides to help you get the most out of DalliAdmin.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>User management guide</li>
              <li>Content management guide</li>
              <li>Settings configuration</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Docs;

