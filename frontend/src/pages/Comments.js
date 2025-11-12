import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Comments = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
  });

  const isEditorOrAdmin = user && (user.is_editor || user.is_admin);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/posts/comments');
      setComments(data);
      setError('');
    } catch (err) {
      setError(err.message || t('comments.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditorOrAdmin) {
      fetchComments();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditorOrAdmin]);

  const handleOpenModal = (comment = null) => {
    if (comment) {
      setSelectedComment(comment);
      setIsEditMode(true);
      setFormData({
        content: comment.content,
      });
    } else {
      setSelectedComment(null);
      setIsEditMode(false);
      setFormData({
        content: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComment(null);
    setFormData({
      content: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/api/posts/comments/${selectedComment.id}`, formData);
      }
      handleCloseModal();
      fetchComments();
    } catch (err) {
      alert(err.message || (isEditMode ? t('comments.failedToUpdate') : t('comments.failedToCreate')));
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(t('comments.confirmDelete'))) {
      return;
    }
    try {
      await api.delete(`/api/posts/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      alert(err.message || t('comments.failedToDelete'));
    }
  };

  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comment.user && comment.user.full_name && comment.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (comment.user && comment.user.email && comment.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 페이징 계산
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComments = filteredComments.slice(startIndex, endIndex);

  // 검색어 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isEditorOrAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{t('comments.editorRequired')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('comments.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('comments.description')}</p>
        </div>
      </div>

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
            placeholder={t('comments.searchComments')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1a1f28]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('comments.content')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('comments.user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('comments.post')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('comments.createdAt')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('comments.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#3a3f4a]">
              {filteredComments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t('comments.noComments')}
                  </td>
                </tr>
              ) : (
                currentComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1f28] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300 max-w-md truncate">{comment.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.user?.full_name || comment.user?.email || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/posts/${comment.post_id}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {t('comments.viewPost')}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(comment)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title={t('common.edit')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64,168,43.31,212.69,88Z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title={t('common.delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192Z"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {filteredComments.length > 0 && (
          <div className="bg-gray-50 dark:bg-[#1a1f28] px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-[#3a3f4a]">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('tables.showing')} <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> {t('tables.to')} <span className="font-medium text-gray-900 dark:text-white">{Math.min(endIndex, filteredComments.length)}</span> {t('tables.of')}{' '}
              <span className="font-medium text-gray-900 dark:text-white">{filteredComments.length}</span> {t('tables.entries')}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-[#3a3f4a]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditMode ? t('comments.editComment') : t('comments.newComment')}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('comments.content')}
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {isEditMode ? t('common.save') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;

