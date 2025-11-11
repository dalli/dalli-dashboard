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
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1f28] transition-colors">
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/posts/${post.id}`)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {t('common.view')}
                        </button>
                        {isEditorOrAdmin && (
                          <>
                            <button
                              onClick={() => navigate(`/posts/edit/${post.id}`)}
                              className="text-green-400 hover:text-green-300"
                            >
                              {t('common.edit')}
                            </button>
                            {(post.author_id === user?.id || user?.is_admin) && (
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                {t('common.delete')}
                              </button>
                            )}
                            <button
                              onClick={() => handlePublish(post.id)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              {post.is_published ? t('posts.unpublish') : t('posts.publish')}
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
      </div>
    </div>
  );
};

export default Posts;

