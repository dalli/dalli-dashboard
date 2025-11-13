import React from 'react';
import HomeHeader from '../components/HomeHeader';

const Products = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111318]">
      <HomeHeader />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white dark:bg-[#282e39] p-6 rounded-lg border border-gray-200 dark:border-[#3a3f4a]">
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Product {item}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This is a sample product description. You can customize this content as needed.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Products;

