import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { useTranslation } from 'react-i18next';

const Users = () => {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    is_admin: false,
    is_active: true,
  });

  const isAdmin = currentUser?.is_admin;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const data = await api.get(`/api/users${searchParam}`);
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || t('users.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setError(t('users.adminRequired'));
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      const debounceTimer = setTimeout(() => {
        fetchUsers();
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, isAdmin]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setIsEditMode(true);
      setFormData({
        email: user.email,
        full_name: user.full_name || '',
        password: '',
        is_admin: user.is_admin,
        is_active: user.is_active,
      });
    } else {
      setSelectedUser(null);
      setIsEditMode(false);
      setFormData({
        email: '',
        full_name: '',
        password: '',
        is_admin: false,
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      full_name: '',
      password: '',
      is_admin: false,
      is_active: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/api/users/${selectedUser.id}`, formData);
      } else {
        if (!formData.password) {
          setError(t('users.passwordRequired'));
          return;
        }
        await api.post('/api/users', formData);
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setError(err.message || t('users.failedToSave'));
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(t('users.confirmDelete'))) {
      return;
    }
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError(err.message || t('users.failedToDelete'));
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.post(`/api/users/${userId}/toggle-active`, {});
      fetchUsers();
    } catch (err) {
      setError(err.message || t('users.failedToToggleStatus'));
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await api.post(`/api/users/${userId}/toggle-admin`, {});
      fetchUsers();
    } catch (err) {
      setError(err.message || t('users.failedToToggleAdmin'));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 페이징 계산
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // 검색어 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{t('users.adminRequired')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUserInitials = (user) => {
    if (user.full_name) {
      return user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('users.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('users.description')}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          {t('users.addNew')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-4 border border-gray-200 dark:border-[#3a3f4a]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-gray-600 dark:text-gray-400">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder={t('users.searchUsers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1a1f28]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('users.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('users.email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('users.role')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('users.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('users.created')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('users.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#3a3f4a]">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1f28] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {getUserInitials(user)}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.full_name || user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_admin
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.is_admin ? t('users.admin') : t('users.user')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user.is_active ? t('users.active') : t('users.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title={t('users.edit')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64,168,43.31,212.69,88Z"></path>
                        </svg>
                      </button>
                      {user.id !== currentUser.id && (
                        <>
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className={`transition-colors ${
                              user.is_active
                                ? 'text-orange-400 hover:text-orange-300'
                                : 'text-green-400 hover:text-green-300'
                            }`}
                            title={user.is_active ? t('users.deactivate') : t('users.activate')}
                          >
                            {user.is_active ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-61.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-16-16a8,8,0,0,1,11.32-11.32L136,180.69l26.34-26.35A8,8,0,0,1,173.66,154.34Z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm32-88a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,128Z"></path>
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(user.id)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                            title={user.is_admin ? t('users.removeAdmin') : t('users.makeAdmin')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm32-88a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,128Z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title={t('users.delete')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192Z"></path>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 dark:bg-[#1a1f28] px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-[#3a3f4a]">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('tables.showing')} <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> {t('tables.to')} <span className="font-medium text-gray-900 dark:text-white">{Math.min(endIndex, filteredUsers.length)}</span> {t('tables.of')}{' '}
              <span className="font-medium text-gray-900 dark:text-white">{filteredUsers.length}</span> {t('tables.entries')}
            </div>
            <div className="flex items-center gap-2">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('tables.show')}</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 bg-white dark:bg-[#282e39] border border-gray-200 dark:border-[#3a3f4a] rounded text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors"
                >
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('tables.entries')}</span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white dark:bg-[#282e39] border border-gray-200 dark:border-[#3a3f4a] rounded text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('tables.previous')}
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 min-w-[32px] rounded text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-[#282e39] border border-gray-200 dark:border-[#3a3f4a] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3f4a]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-500 dark:text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white dark:bg-[#282e39] border border-gray-200 dark:border-[#3a3f4a] rounded text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('tables.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleCloseModal}></div>
            <div className="relative bg-white dark:bg-[#282e39] rounded-lg shadow-xl max-w-md w-full p-6 z-50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {isEditMode ? t('users.editUser') : t('users.addNewUser')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('users.emailLabel')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('users.fullName')}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('users.password')} {isEditMode ? t('users.passwordOptional') : '*'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditMode}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('users.isAdmin')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('users.isActive')}</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1f2e]"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    {isEditMode ? t('users.update') : t('users.create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
