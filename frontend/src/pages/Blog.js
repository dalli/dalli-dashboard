import React from 'react';
import HomeHeader from '../components/HomeHeader';

const Blog = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111318]">
      <HomeHeader />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Blog</h1>
        <div className="space-y-8">
          {[1, 2, 3, 4].map((item) => (
            <article key={item} className="bg-white dark:bg-[#282e39] p-6 rounded-lg border border-gray-200 dark:border-[#3a3f4a]">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Blog Post Title {item}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Published on {new Date(2024, 0, item).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                This is a sample blog post. You can customize this content with your actual blog posts.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua.
              </p>
              <button className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline text-left">
                Read more →
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Blog;

