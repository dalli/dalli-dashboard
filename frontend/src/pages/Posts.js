import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Posts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isEditorOrAdmin = user && (user.is_editor || user.is_admin);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (publishedFilter === 'published') {
        params.append('published_only', 'true');
      } else if (publishedFilter === 'draft') {
        params.append('published_only', 'false');
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      const queryString = params.toString();
      const endpoint = `/api/posts${queryString ? `?${queryString}` : ''}`;
      const data = await api.get(endpoint);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // 에러 메시지를 사용자에게 표시하지 않고 빈 배열로 설정
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    if (!window.confirm(t('posts.confirmDelete'))) {
      return;
    }
    try {
      await api.delete(`/api/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      alert(t('posts.failedToDelete'));
    }
  };

  const handlePublish = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/publish`);
      fetchPosts();
    } catch (error) {
      alert(t('posts.failedToPublish'));
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이징 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // 검색어나 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, publishedFilter, itemsPerPage]);

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

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('posts.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('posts.description')}</p>
        </div>
        {isEditorOrAdmin && (
          <button
            onClick={() => navigate('/posts/new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {t('posts.newPost')}
          </button>
        )}
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
                placeholder={t('posts.searchPosts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {isEditorOrAdmin && (
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('posts.allPosts')}</option>
              <option value="published">{t('posts.published')}</option>
              <option value="draft">{t('posts.draft')}</option>
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1a1f28]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.title')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.category')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.tags')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.author')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.createdAt')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('posts.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#3a3f4a]">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t('posts.noPosts')}
                  </td>
                </tr>
              ) : (
                currentPosts.map((post) => (
                  <tr 
                    key={post.id} 
                    className="hover:bg-gray-50 dark:hover:bg-[#1a1f28] transition-colors cursor-pointer"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.category ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('posts.noCategory')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags && post.tags.length > 0 ? (
                          post.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400"
                            >
                              {tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {post.author?.full_name || post.author?.email || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.is_published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {post.is_published ? t('posts.published') : t('posts.draft')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {isEditorOrAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/posts/edit/${post.id}`);
                              }}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              title={t('common.edit')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM192,108.68,147.31,64,168,43.31,212.69,88Z"></path>
                              </svg>
                            </button>
                            {(post.author_id === user?.id || user?.is_admin) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(post.id);
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title={t('common.delete')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192Z"></path>
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublish(post.id);
                              }}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                              title={post.is_published ? t('posts.unpublish') : t('posts.publish')}
                            >
                              {post.is_published ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v24h24A8,8,0,0,1,176,128Z"></path>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v24h24A8,8,0,0,1,176,128Z"></path>
                                </svg>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {filteredPosts.length > 0 && (
          <div className="bg-gray-50 dark:bg-[#1a1f28] px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-[#3a3f4a]">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('tables.showing')} <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> {t('tables.to')} <span className="font-medium text-gray-900 dark:text-white">{Math.min(endIndex, filteredPosts.length)}</span> {t('tables.of')}{' '}
              <span className="font-medium text-gray-900 dark:text-white">{filteredPosts.length}</span> {t('tables.entries')}
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
    </div>
  );
};

export default Posts;

