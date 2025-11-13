import React from 'react';
import { Link } from 'react-router-dom';
import HomeHeader from '../components/HomeHeader';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111318]">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            The next generation
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              of admin dashboard.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            DalliAdmin is the modern admin platform
            <br />
            where teams manage their data, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get started for free
            </Link>
            <Link
              to="/signin"
              className="px-8 py-4 bg-white dark:bg-[#282e39] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3a3f4a] rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-[#3a3f4a] transition-colors"
            >
              Request a demo
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Free for your first 30 days. No credit card required.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0d12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage faster
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              One end-to-end tool to simplify and accelerate your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-[#111318] p-6 rounded-lg border border-gray-200 dark:border-[#282e39]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V168H76.69L96,187.32A15.89,15.89,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Dashboard Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get comprehensive insights and analytics on your data with our powerful dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-[#111318] p-6 rounded-lg border border-gray-200 dark:border-[#282e39]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,64H216v56H40Zm176,128H40V136H216v56Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Content Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your posts, categories, and comments with ease and efficiency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-[#111318] p-6 rounded-lg border border-gray-200 dark:border-[#282e39]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h56A8,8,0,0,1,192,128Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                User Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Control and manage user access with our comprehensive user management system.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-[#111318] p-6 rounded-lg border border-gray-200 dark:border-[#282e39]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h72A8,8,0,0,1,176,128Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stay up-to-date with real-time notifications and updates across your platform.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-[#111318] p-6 rounded-lg border border-gray-200 dark:border-[#282e39]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm32-88a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,128Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise-grade security and reliability to keep your data safe and accessible.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-[#111318] p-6 rounded-lg border border-gray-200 dark:border-[#282e39]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-88a8,8,0,0,1-8,8H120v16a8,8,0,0,1-16,0V136a8,8,0,0,1,8-8h16A8,8,0,0,1,144,128Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Customizable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tailor the platform to your needs with extensive customization options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Built for modern teams, now available for everyone
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start free trial
            </Link>
            <Link
              to="/signin"
              className="px-8 py-4 bg-white dark:bg-[#282e39] text-gray-900 dark:text-white border border-gray-300 dark:border-[#3a3f4a] rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-[#3a3f4a] transition-colors"
            >
              Request a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DA</span>
              </div>
                <h3 className="text-white font-bold text-xl">DalliAdmin</h3>
              </div>
              <p className="text-sm">
                The modern admin platform for teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/posts" className="hover:text-white transition-colors">Posts</Link></li>
                <li><Link to="/users" className="hover:text-white transition-colors">Users</Link></li>
                <li><Link to="/settings" className="hover:text-white transition-colors">Settings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors text-left">About</button></li>
                <li><button className="hover:text-white transition-colors text-left">Blog</button></li>
                <li><button className="hover:text-white transition-colors text-left">Careers</button></li>
                <li><button className="hover:text-white transition-colors text-left">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors text-left">Documentation</button></li>
                <li><button className="hover:text-white transition-colors text-left">Support</button></li>
                <li><button className="hover:text-white transition-colors text-left">Privacy</button></li>
                <li><button className="hover:text-white transition-colors text-left">Terms</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 DalliAdmin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

