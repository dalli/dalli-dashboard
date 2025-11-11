import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPasswordRequest, resetPassword } = useAuth();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPasswordRequest(email);
      setSuccess('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (err) {
      setError(err.message || '요청 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword);
      setSuccess('비밀번호가 성공적으로 재설정되었습니다.');
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (err) {
      setError(err.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    // 토큰이 있으면 비밀번호 재설정 폼 표시
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#111318]">
        {/* 왼쪽: 비밀번호 재설정 폼 */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:flex-none lg:w-1/2">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Link to="/signin" className="text-primary hover:text-primary/80 text-sm font-medium mb-6 inline-block">
                ← 로그인으로 돌아가기
              </Link>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                비밀번호 재설정
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                새 비밀번호를 입력해주세요
              </p>
            </div>
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="text-sm text-green-800 dark:text-green-200">{success}</div>
              </div>
            )}
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  새 비밀번호
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f2e] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm mt-1"
                  placeholder="새 비밀번호 (최소 6자)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="relative block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f2e] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm mt-1"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-primary py-2.5 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '비밀번호 재설정'}
              </button>
            </div>
          </form>
        </div>
        </div>

        {/* 오른쪽: 정보 영역 */}
        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                비밀번호 재설정
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                안전하고 강력한 새 비밀번호를 설정하여 계정을 보호하세요.
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">강력한 비밀번호</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">최소 6자 이상의 비밀번호를 사용하세요</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">정기적 변경</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">보안을 위해 정기적으로 비밀번호를 변경하세요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 토큰이 없으면 이메일 요청 폼 표시
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#111318]">
      {/* 왼쪽: 비밀번호 재설정 요청 폼 */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:flex-none lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/signin" className="text-primary hover:text-primary/80 text-sm font-medium mb-6 inline-block">
              ← 로그인으로 돌아가기
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              비밀번호를 잊으셨나요?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              계정에 연결된 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </p>
          </div>
        <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="text-sm text-green-800 dark:text-green-200">{success}</div>
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f2e] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm mt-1"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary py-2.5 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '전송 중...' : '재설정 링크 전송'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link
              to="/signin"
              className="text-primary hover:text-primary/80 font-medium"
            >
              잠깐, 비밀번호가 기억나요? 여기를 클릭하세요
            </Link>
          </div>
        </form>
      </div>
      </div>

      {/* 오른쪽: 정보 영역 */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              이메일 확인
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              비밀번호 재설정 링크를 이메일로 보내드립니다. 받은 편지함을 확인해주세요.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">빠른 처리</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">몇 분 안에 이메일을 받으실 수 있습니다</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">안전한 링크</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">재설정 링크는 1시간 동안 유효합니다</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">스팸 폴더 확인</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">이메일이 보이지 않으면 스팸 폴더를 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

