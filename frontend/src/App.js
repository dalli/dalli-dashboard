import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Forms from './pages/Forms';
import Charts from './pages/Charts';
import UIElements from './pages/UIElements';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import TwoStepVerification from './pages/TwoStepVerification';
import Users from './pages/Users';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 인증 페이지들 (레이아웃 없음) */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/two-step-verification" element={<TwoStepVerification />} />
            
            {/* 보호된 라우트들 (레이아웃 있음) */}
            <Route
              path="/*"
              element={
                <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-[#111318] group/design-root overflow-x-hidden transition-colors" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
                  <div className="layout-container flex h-full grow flex-col">
                    <div className="flex">
                      {/* Sidebar */}
                      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 h-screen z-40 transition-transform duration-300 ease-in-out`}>
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                      </aside>
                      
                      {/* Overlay for mobile */}
                      {sidebarOpen && (
                        <div 
                          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                          onClick={() => setSidebarOpen(false)}
                        />
                      )}
                      
                      {/* Main Content Area */}
                      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
                        <Header onMenuClick={toggleSidebar} />
                        <main className="min-h-screen">
                          <Routes>
                            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                            <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
                            <Route path="/forms" element={<ProtectedRoute><Forms /></ProtectedRoute>} />
                            <Route path="/charts" element={<ProtectedRoute><Charts /></ProtectedRoute>} />
                            <Route path="/ui-elements" element={<ProtectedRoute><UIElements /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
