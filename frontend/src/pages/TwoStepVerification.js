import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TwoStepVerification = () => {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const { verify2FA, setup2FA, enable2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // URL 파라미터로 setup 모드 확인
    if (searchParams.get('setup') === 'true') {
      handleSetup();
    }
  }, []);

  const handleSetup = async () => {
    try {
      const data = await setup2FA();
      setQrCode(data.qr_code);
      setSecret(data.secret);
      setSetupMode(true);
    } catch (err) {
      setError(err.message || '2단계 인증 설정에 실패했습니다.');
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // 자동으로 다음 입력 필드로 이동
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      document.getElementById('code-5')?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('6자리 코드를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      if (setupMode) {
        await enable2FA(verificationCode);
        setSuccess('2단계 인증이 활성화되었습니다.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        await verify2FA(verificationCode);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || '인증에 실패했습니다.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#111318] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {setupMode ? '2단계 인증 설정' : '2단계 인증'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {setupMode
              ? 'QR 코드를 스캔하고 인증 앱에서 생성된 6자리 코드를 입력하세요'
              : '인증 앱에서 생성된 6자리 코드를 입력하세요'}
          </p>
        </div>

        {setupMode && qrCode && (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white dark:bg-[#1a1f2e] p-4 rounded-lg">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                또는 수동으로 입력:
              </p>
              <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {secret}
              </p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="group relative flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '확인 중...' : setupMode ? '활성화' : '확인'}
            </button>
          </div>

          {!setupMode && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleSetup}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                2단계 인증 설정하기
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TwoStepVerification;

