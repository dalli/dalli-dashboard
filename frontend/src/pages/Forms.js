import React, { useState } from 'react';

const Forms = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forms</h1>
        <p className="text-gray-600 dark:text-gray-400">Create and manage forms with various input types.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Form */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Inactive</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter description"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setFormData({ name: '', email: '', role: '', status: 'Active', description: '' })}
                className="px-6 py-2 bg-gray-50 dark:bg-[#1a1f28] hover:bg-gray-100 dark:hover:bg-[#3a3f4a] text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-200 dark:border-[#3a3f4a]"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Form Examples */}
        <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Input Examples</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Input</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number Input</label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Input</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Input</label>
              <input
                type="file"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-700 dark:text-gray-300">I agree to the terms and conditions</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-gray-700 dark:text-gray-300">Subscribe to newsletter</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forms;

