import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // localStorage에서 테마 가져오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // 시스템 설정 확인
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; // 기본값
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      const body = document.body;

      if (!root || !body) {
        return;
      }

      if (theme === 'auto') {
        // 시스템 설정에 따라 자동으로 변경
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = (e) => {
          try {
            if (e.matches) {
              root.classList.add('dark');
              body.classList.add('dark');
            } else {
              root.classList.remove('dark');
              body.classList.remove('dark');
            }
          } catch (error) {
            console.warn('Theme update error:', error);
          }
        };
        
        updateTheme(mediaQuery);
        mediaQuery.addEventListener('change', updateTheme);
        
        return () => {
          try {
            mediaQuery.removeEventListener('change', updateTheme);
          } catch (error) {
            console.warn('Theme cleanup error:', error);
          }
        };
      } else {
        // 수동 테마 설정
        if (theme === 'dark') {
          root.classList.add('dark');
          body.classList.add('dark');
        } else {
          root.classList.remove('dark');
          body.classList.remove('dark');
        }
      }

      // localStorage에 저장
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('localStorage error:', error);
      }
    } catch (error) {
      console.warn('Theme context error:', error);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

