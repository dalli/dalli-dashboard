import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#111318]">
      {/* 왼쪽: 로그인 폼 */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:flex-none lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="text-primary hover:text-primary/80 text-sm font-medium mb-6 inline-block">
              ← 대시보드로 돌아가기
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              로그인
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              이메일과 비밀번호를 입력하여 로그인하세요!
            </p>
          </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f2e] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm mt-1"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                로그인 상태 유지
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/reset-password"
                className="font-medium text-primary hover:text-primary/80"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary py-2.5 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">계정이 없으신가요? </span>
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              회원가입
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              안전하고 빠른 로그인
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              강력한 보안 기능과 직관적인 인터페이스로 더 나은 경험을 제공합니다.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">2단계 인증 지원</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">추가 보안 레이어로 계정을 보호하세요</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">빠른 접근</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">한 번의 클릭으로 모든 기능에 접근하세요</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">데이터 보호</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">최신 암호화 기술로 데이터를 안전하게 보관합니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

