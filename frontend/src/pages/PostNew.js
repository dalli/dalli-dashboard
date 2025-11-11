import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const PostNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/api/posts/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await api.get('/api/posts/tags');
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const tagName = tagInput.trim();
      // 태그 목록에서 찾거나 새로 추가
      const existingTag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      if (existingTag) {
        if (!selectedTags.find(t => t.id === existingTag.id)) {
          setSelectedTags([...selectedTags, existingTag]);
        }
      } else {
        // 새 태그는 임시로 추가 (백엔드에서 처리)
        const newTag = { id: `temp-${Date.now()}`, name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') };
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  // 편집자 또는 관리자만 접근 가능
  if (!user || (!user.is_editor && !user.is_admin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{t('posts.editorRequired')}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert(t('posts.titleAndContentRequired'));
      return;
    }

    try {
      setLoading(true);
      // 기존 태그 ID와 새 태그 이름 분리
      const existingTagIds = selectedTags
        .filter(t => typeof t.id === 'number')
        .map(t => t.id);
      const newTagNames = selectedTags
        .filter(t => typeof t.id === 'string' && t.id.startsWith('temp-'))
        .map(t => t.name);
      
      await api.post('/api/posts', {
        title,
        slug: slug || title,
        content,
        category_id: categoryId || null,
        tag_ids: existingTagIds.length > 0 ? existingTagIds : null,
        tag_names: newTagNames.length > 0 ? newTagNames : null,
      });
      navigate('/posts');
    } catch (error) {
      alert(t('posts.failedToCreate'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('posts.newPost')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('posts.createNewPost')}</p>
        </div>
        <button
          onClick={() => navigate('/posts')}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          {t('common.cancel')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#282e39] rounded-lg p-6 border border-gray-200 dark:border-[#3a3f4a]">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('posts.title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('posts.slug')} ({t('posts.optional')})
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('posts.slugPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('posts.category')}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('posts.selectCategory')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('posts.tags')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg min-h-[50px]">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="ml-1 text-blue-400 hover:text-blue-300"
                    title={t('posts.removeTag')}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder={t('posts.tagPlaceholder')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1a1f28] border border-gray-200 dark:border-[#3a3f4a] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('posts.tagPlaceholder')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('posts.content')}
            </label>
            <SimpleMDE
              value={content}
              onChange={setContent}
              options={{
                placeholder: t('posts.contentPlaceholder'),
                spellChecker: false,
                autofocus: true,
              }}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('posts.create')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostNew;

