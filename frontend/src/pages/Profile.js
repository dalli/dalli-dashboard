import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    job_title: '',
    location: '',
    country: '',
    city_state: '',
    postal_code: '',
    tax_id: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
  });

  const profileUserId = userId ? parseInt(userId) : (currentUser?.id || null);
  const canEdit = currentUser && (currentUser.id === profileUserId || currentUser.is_admin);

  useEffect(() => {
    if (profileUserId) {
      fetchProfile();
    }
  }, [profileUserId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await api.get(`/api/profile/${profileUserId}`);
      setProfile(profileData);
      
      // 프로파일 응답에 사용자 정보가 포함됨
      setUser({
        id: profileData.user_id,
        email: profileData.email || 'N/A',
        full_name: profileData.full_name || null,
      });
      
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        job_title: profileData.job_title || '',
        location: profileData.location || '',
        country: profileData.country || '',
        city_state: profileData.city_state || '',
        postal_code: profileData.postal_code || '',
        tax_id: profileData.tax_id || '',
        facebook_url: profileData.facebook_url || '',
        twitter_url: profileData.twitter_url || '',
        linkedin_url: profileData.linkedin_url || '',
        instagram_url: profileData.instagram_url || '',
      });
    } catch (err) {
      setError(err.message || t('profile.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePersonal = async () => {
    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        bio: formData.bio,
        job_title: formData.job_title,
        location: formData.location,
      };
      const updated = await api.put(`/api/profile/${profileUserId}`, updateData);
      setProfile(updated);
      setIsEditingPersonal(false);
    } catch (err) {
      setError(err.message || t('profile.failedToUpdate'));
    }
  };

  const handleSaveAddress = async () => {
    try {
      const updateData = {
        country: formData.country,
        city_state: formData.city_state,
        postal_code: formData.postal_code,
        tax_id: formData.tax_id,
      };
      const updated = await api.put(`/api/profile/${profileUserId}`, updateData);
      setProfile(updated);
      setIsEditingAddress(false);
    } catch (err) {
      setError(err.message || t('profile.failedToUpdateAddress'));
    }
  };

  const handleSaveSocial = async () => {
    try {
      const updateData = {
        facebook_url: formData.facebook_url,
        twitter_url: formData.twitter_url,
        linkedin_url: formData.linkedin_url,
        instagram_url: formData.instagram_url,
      };
      const updated = await api.put(`/api/profile/${profileUserId}`, updateData);
      setProfile(updated);
    } catch (err) {
      setError(err.message || t('profile.failedToUpdateSocial'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary hover:text-primary/80"
          >
            {t('profile.goBack')}
          </button>
        </div>
      </div>
    );
  }

  const fullName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || currentUser?.full_name || 'User'
    : currentUser?.full_name || 'User';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 dark:text-gray-400 hover:text-primary">
                {t('common.home')}
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-700 dark:text-gray-400 md:ml-2">{t('profile.title')}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 프로파일 카드 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] p-6">
            <div className="flex flex-col items-center">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={fullName}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-3xl mb-4">
                  {initials}
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {profile?.job_title || t('profile.noTitle')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {profile?.location || currentUser?.email || t('profile.noLocation')}
              </p>
              {canEdit && (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t('common.edit')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 프로파일 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('profile.personalInformation')}
              </h3>
              {canEdit && !isEditingPersonal && (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  {t('common.edit')}
                </button>
              )}
            </div>

            {isEditingPersonal ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.firstName')}
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('profile.lastName')}
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-[#1a1f2e] text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.bio')}
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditingPersonal(false);
                      fetchProfile();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1f2e]"
                  >
                    {t('common.close')}
                  </button>
                  <button
                    onClick={handleSavePersonal}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    {t('profile.saveChanges')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.firstName')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.first_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.lastName')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.last_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.emailAddress')}</p>
                  <p className="text-gray-900 dark:text-white">{currentUser?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.phone')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.bio')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.bio || '-'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('profile.address')}</h3>
              {canEdit && !isEditingAddress && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  {t('common.edit')}
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.country')}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.cityState')}
                  </label>
                  <input
                    type="text"
                    name="city_state"
                    value={formData.city_state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.postalCode')}
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.taxId')}
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditingAddress(false);
                      fetchProfile();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1f2e]"
                  >
                    {t('common.close')}
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    {t('profile.saveChanges')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.country')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.country || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.cityState')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.city_state || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.postalCode')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.postal_code || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.taxId')}</p>
                  <p className="text-gray-900 dark:text-white">{profile?.tax_id || '-'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          {canEdit && (
            <div className="bg-white dark:bg-[#282e39] rounded-lg border border-gray-200 dark:border-[#3a3f4a] p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('profile.socialLinks')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.facebook')}
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    onBlur={handleSaveSocial}
                    placeholder="https://facebook.com/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.xcom')}
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    onBlur={handleSaveSocial}
                    placeholder="https://x.com/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.linkedin')}
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    onBlur={handleSaveSocial}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.instagram')}
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    onBlur={handleSaveSocial}
                    placeholder="https://instagram.com/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
