import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
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
  const contentRef = useRef(null);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  useEffect(() => {
    // Mermaid 초기화
    if (typeof window !== 'undefined') {
      mermaid.initialize({ 
        startOnLoad: true,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        securityLevel: 'loose'
      });
    }
  }, []);

  useEffect(() => {
    // Mermaid 다이어그램 렌더링
    if (contentRef.current && post && typeof window !== 'undefined') {
      const mermaidElements = contentRef.current.querySelectorAll('.language-mermaid');
      mermaidElements.forEach((element, index) => {
        const code = element.textContent;
        if (code && code.trim()) {
          const uniqueId = `mermaid-${id}-${index}-${Date.now()}`;
          const mermaidDiv = document.createElement('div');
          mermaidDiv.className = 'mermaid';
          mermaidDiv.id = uniqueId;
          mermaidDiv.textContent = code.trim();
          
          // 기존 pre 요소를 mermaid div로 교체
          const preElement = element.closest('pre');
          if (preElement && preElement.parentElement) {
            preElement.parentElement.replaceChild(mermaidDiv, preElement);
            
            // Mermaid 렌더링
            mermaid.run({
              nodes: [mermaidDiv]
            }).catch(err => {
              console.error('Mermaid rendering error:', err);
            });
          }
        }
      });
    }
  }, [post, id]);

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
    <div className="flex flex-col gap-6 p-6 max-w-full overflow-x-hidden">
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
            {t('common.list')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a] max-w-full overflow-x-hidden">
        <div ref={contentRef} className="prose dark:prose-invert max-w-full prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-900 dark:prose-code:text-white prose-pre:bg-gray-100 dark:prose-pre:bg-[#1a1f28] prose-table:border-gray-300 dark:prose-table:border-[#3a3f4a] overflow-x-auto">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => (
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-[#3a3f4a]" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-[#3a3f4a]" {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-5 mb-2" {...props} />
              ),
              h4: ({node, ...props}) => (
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />
              ),
              h5: ({node, ...props}) => (
                <h5 className="text-lg font-medium text-gray-900 dark:text-white mt-3 mb-2" {...props} />
              ),
              h6: ({node, ...props}) => (
                <h6 className="text-base font-medium text-gray-900 dark:text-white mt-3 mb-2" {...props} />
              ),
              p: ({node, ...props}) => (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 ml-4" {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 ml-4" {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="mb-1 leading-relaxed" {...props} />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3a3f4a] border border-gray-300 dark:border-[#3a3f4a] rounded-lg" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => (
                <thead className="bg-gray-50 dark:bg-[#1a1f28]" {...props} />
              ),
              tbody: ({node, ...props}) => (
                <tbody className="bg-white dark:bg-[#282e39] divide-y divide-gray-200 dark:divide-[#3a3f4a]" {...props} />
              ),
              th: ({node, ...props}) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" {...props} />
              ),
              pre: ({children, ...props}) => {
                return (
                  <pre className="bg-gray-50 dark:bg-[#1a1f28] p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-[#3a3f4a] my-4" {...props}>
                    {children}
                  </pre>
                );
              },
              code: ({node, inline, className, children, ...props}) => {
                if (inline) {
                  return (
                    <code className="bg-gray-100 dark:bg-[#1a1f28] text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-[#3a3f4a]" {...props}>
                      {children}
                    </code>
                  );
                }
                
                // 코드 블록 (inline이 false인 경우)
                const match = /language-(\w+)/.exec(className || '');
                const language = match && match[1];
                
                if (language === 'mermaid') {
                  return (
                    <code className="language-mermaid" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </code>
                  );
                }
                
                return (
                  <code className={`${className} text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre`} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
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

