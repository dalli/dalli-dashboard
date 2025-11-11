import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const PostDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/posts/${id}`);
      setPost(data);
    } catch (error) {
      alert(t('posts.failedToLoad'));
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await api.get(`/api/posts/${id}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      return;
    }

    try {
      setSubmittingComment(true);
      await api.post(`/api/posts/${id}/comments`, {
        content: commentContent,
      });
      setCommentContent('');
      fetchComments();
    } catch (error) {
      alert(t('comments.failedToCreate'));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t('comments.confirmDelete'))) {
      return;
    }
    try {
      await api.delete(`/api/posts/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      alert(t('comments.failedToDelete'));
    }
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

  if (!post) {
    return null;
  }

  const canEdit = user && (user.is_editor || user.is_admin);
  const canDelete = user && (post.author_id === user.id || user.is_admin);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{t('posts.by')} {post.author?.full_name || post.author?.email || 'Unknown'}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            {post.is_published && (
              <>
                <span>•</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                  {t('posts.published')}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => navigate(`/posts/edit/${id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t('common.edit')}
            </button>
          )}
          <button
            onClick={() => navigate('/posts')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {t('common.back')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('comments.title')}</h2>

        {/* Comment Form */}
        {post.is_published && (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder={t('comments.placeholder')}
              rows="4"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              required
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {submittingComment ? t('common.loading') : t('comments.submit')}
            </button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">{t('comments.noComments')}</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 dark:border-[#3a3f4a] pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.user?.full_name || comment.user?.email || 'Unknown'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                  {(comment.user_id === user?.id || user?.is_admin) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      {t('common.delete')}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;

