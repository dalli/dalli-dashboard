import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ onClose, collapsed = false }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [postsMenuOpen, setPostsMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const [profileMenuStyle, setProfileMenuStyle] = useState({});
  const postsSubmenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // 사용자 이니셜 생성
  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const menuItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V168H76.69L96,187.32A15.89,15.89,0,0,0,107.31,192h41.38A15.86,15.86,0,0,0,160,187.31L179.31,168H208v40Z"></path>
        </svg>
      ),
      label: t('sidebar.dashboard'),
      path: '/dashboard',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,64H216v56H40Zm176,128H40V136H216v56Z"></path>
        </svg>
      ),
      label: t('sidebar.posts'),
      path: '/posts',
      hasSubmenu: true,
      submenu: [
        { label: t('sidebar.postsList'), path: '/posts' },
        { label: t('sidebar.categories'), path: '/posts/categories' },
        { label: t('sidebar.comments'), path: '/posts/comments' },
      ],
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
        </svg>
      ),
      label: t('sidebar.users'),
      path: '/users',
    },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const isPostsMenuActive = () => {
    return location.pathname.startsWith('/posts');
  };

  React.useEffect(() => {
    if (isPostsMenuActive()) {
      setPostsMenuOpen(true);
    } else {
      setPostsMenuOpen(false);
    }
    // 경로가 변경되면 프로필 팝업 닫기
    setIsProfileOpen(false);
  }, [location.pathname]);

  // 프로필 팝업 위치 조정
  React.useEffect(() => {
    if (isProfileOpen && profileButtonRef.current) {
      // 다음 프레임에서 위치 계산 (렌더링 후)
      setTimeout(() => {
        if (profileButtonRef.current && profileMenuRef.current) {
          const buttonElement = profileButtonRef.current;
          const menuElement = profileMenuRef.current;
          const buttonRect = buttonElement.getBoundingClientRect();
          const menuRect = menuElement.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          if (collapsed) {
            // collapsed 상태: left-full로 오른쪽에 열림
            // 팝업이 화면 하단을 벗어나는지 확인
            if (menuRect.bottom > windowHeight) {
              setProfileMenuStyle({
                bottom: '0px',
                top: 'auto'
              });
            } else {
              setProfileMenuStyle({});
            }
          } else {
            // 일반 상태: bottom-full로 위에 열림
            // bottom-full이 적용된 상태에서 팝업의 실제 위치 확인
            // menuRect는 이미 bottom-full이 적용된 상태의 위치를 반환
            // 팝업의 상단이 화면 밖으로 나가거나, 팝업이 화면 하단을 벗어나는지 확인
            if (menuRect.top < 0 || menuRect.bottom > windowHeight) {
              // 하단에 맞추기
              setProfileMenuStyle({
                bottom: '0px',
                top: 'auto',
                marginBottom: '0'
              });
            } else {
              // 기본 위치 유지
              setProfileMenuStyle({
                bottom: 'auto',
                top: 'auto',
                marginBottom: '0.5rem'
              });
            }
          }
        }
      }, 0);
    } else {
      setProfileMenuStyle({});
    }
  }, [isProfileOpen, collapsed]);

  // 외부 클릭 시 게시글 서브메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (postsMenuOpen && collapsed && postsSubmenuRef.current) {
        // 게시글 서브메뉴나 게시글 메뉴 버튼 내부를 클릭했는지 확인
        const target = event.target;
        const isClickInside = postsSubmenuRef.current.contains(target);
        
        if (!isClickInside) {
          setPostsMenuOpen(false);
        }
      }
    };

    if (postsMenuOpen && collapsed) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [postsMenuOpen, collapsed]);

  return (
    <div className={`flex h-full min-h-screen flex-col justify-between bg-white dark:bg-[#111318] border-r border-gray-200 dark:border-[#282e39] transition-all duration-300 ${collapsed ? 'w-16 p-2' : 'w-64 p-4'}`}>
      <div className="flex flex-col gap-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DA</span>
            </div>
            <h1 className="text-gray-900 dark:text-white text-xl font-bold">DalliAdmin</h1>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="flex items-center justify-center mb-4 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DA</span>
            </div>
          </Link>
        )}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.path}>
              {item.hasSubmenu ? (
                <div className="relative group" ref={postsSubmenuRef}>
                  <button
                    onClick={() => {
                      setPostsMenuOpen(!postsMenuOpen);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 ${collapsed ? 'px-2' : 'px-3'} py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-gray-100 dark:bg-[#282e39] text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-[#9da6b9] hover:bg-gray-100 dark:hover:bg-[#282e39] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                      <div className="flex-shrink-0">{item.icon}</div>
                      {!collapsed && <p className="text-sm font-medium leading-normal">{item.label}</p>}
                    </div>
                    {!collapsed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className={`transition-transform ${postsMenuOpen ? 'rotate-90' : ''}`}
                      >
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                      </svg>
                    )}
                  </button>
                  {collapsed && (
                    <>
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                      {postsMenuOpen && (
                        <div className="absolute left-full ml-2 top-0 bg-white dark:bg-[#282e39] rounded-lg shadow-lg border border-gray-200 dark:border-[#3a3f4a] py-2 min-w-[200px] z-50">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => {
                                setIsProfileOpen(false);
                                setPostsMenuOpen(false);
                                if (window.innerWidth < 1024 && onClose) {
                                  onClose();
                                }
                              }}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                location.pathname === subItem.path || (subItem.path === '/posts' && location.pathname.startsWith('/posts') && !location.pathname.startsWith('/posts/categories') && !location.pathname.startsWith('/posts/comments'))
                                  ? 'bg-gray-100 dark:bg-[#282e39] text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3f4a]'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {postsMenuOpen && !collapsed && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (window.innerWidth < 1024 && onClose) {
                              onClose();
                            }
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === subItem.path || (subItem.path === '/posts' && location.pathname.startsWith('/posts') && !location.pathname.startsWith('/posts/categories') && !location.pathname.startsWith('/posts/comments'))
                              ? 'bg-gray-100 dark:bg-[#282e39] text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-[#9da6b9] hover:bg-gray-100 dark:hover:bg-[#282e39] hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <p className="text-sm font-medium leading-normal">{subItem.label}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIsProfileOpen(false);
                      setPostsMenuOpen(false);
                      if (window.innerWidth < 1024 && onClose) {
                        onClose();
                      }
                    }}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-3'} py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-gray-100 dark:bg-[#282e39] text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-[#9da6b9] hover:bg-gray-100 dark:hover:bg-[#282e39] hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!collapsed && <p className="text-sm font-medium leading-normal">{item.label}</p>}
                  </Link>
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="relative group">
          <Link
            to="/settings"
            onClick={() => {
              setIsProfileOpen(false);
              setPostsMenuOpen(false);
              // 모바일에서 링크 클릭 시 사이드바 닫기
              if (window.innerWidth < 1024 && onClose) {
                onClose();
              }
            }}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-3'} py-2 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-gray-100 dark:bg-[#282e39] text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-[#9da6b9] hover:bg-gray-100 dark:hover:bg-[#282e39] hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
            </div>
            {!collapsed && <p className="text-sm font-medium leading-normal">{t('common.settings')}</p>}
          </Link>
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
              {t('common.settings')}
            </div>
          )}
        </div>
        {/* User Profile */}
        <div className="relative group">
          <button
            ref={profileButtonRef}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-3'} py-2 rounded-lg transition-colors text-gray-600 dark:text-[#9da6b9] hover:bg-gray-100 dark:hover:bg-[#282e39] hover:text-gray-900 dark:hover:text-white`}
          >
            <div className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
              {getUserInitials()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-normal text-gray-900 dark:text-white truncate">
                  {user?.full_name || t('common.user')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </button>
          {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
              {user?.full_name || t('common.user')}
            </div>
          )}
          {isProfileOpen && (
            <div 
              ref={profileMenuRef}
              className={`absolute ${collapsed ? `left-full ml-2 ${profileMenuStyle.bottom === '0px' ? 'bottom-0' : ''}` : profileMenuStyle.bottom === '0px' ? 'left-0 bottom-0' : 'bottom-full left-0 mb-2'} w-48 bg-white dark:bg-[#282e39] rounded-lg shadow-lg border border-gray-200 dark:border-[#3a3f4a] py-2 transition-colors z-50`}
              style={profileMenuStyle}
            >
              <Link
                to="/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (window.innerWidth < 1024 && onClose) {
                    onClose();
                  }
                }}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors"
              >
                {t('common.profile')}
              </Link>
              <Link
                to="/settings"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (window.innerWidth < 1024 && onClose) {
                    onClose();
                  }
                }}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors"
              >
                {t('common.settings')}
              </Link>
              <hr className="my-2 border-gray-200 dark:border-[#3a3f4a]" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (window.innerWidth < 1024 && onClose) {
                    onClose();
                  }
                  handleLogout();
                }}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3f4a] transition-colors"
              >
                {t('common.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
