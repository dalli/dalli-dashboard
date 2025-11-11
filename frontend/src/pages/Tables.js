import React, { useState } from 'react';

const Tables = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', date: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', date: '2024-01-13' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'Active', date: '2024-01-12' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active', date: '2024-01-11' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active', date: '2024-01-10' },
    { id: 7, name: 'Eve Adams', email: 'eve@example.com', role: 'User', status: 'Inactive', date: '2024-01-09' },
    { id: 8, name: 'Frank Miller', email: 'frank@example.com', role: 'Editor', status: 'Active', date: '2024-01-08' },
  ];

  const filteredData = tableData.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tables</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and view all your data in organized tables.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-lg transition-colors">
          Add New
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-4 border border-gray-200 dark:border-[#3a3f4a]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-gray-600 dark:text-gray-400">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="User">User</option>
          </select>
          <select className="px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1a1f28]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#3a3f4a]">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:bg-[#1a1f28] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-gray-900 dark:text-white font-semibold text-sm mr-3">
                        {row.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{row.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{row.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                      {row.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.status === 'Active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-[#1a1f28] px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-[#3a3f4a]">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">8</span> of{' '}
            <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white dark:bg-[#282e39] border border-gray-200 dark:border-[#3a3f4a] rounded text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-white dark:bg-[#282e39] border border-gray-200 dark:border-[#3a3f4a] rounded text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tables;

