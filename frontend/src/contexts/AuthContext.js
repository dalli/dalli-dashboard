import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userData = await api.get('/api/auth/me');
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    await fetchUser();
    return data;
  };

  const signup = async (email, password, fullName) => {
    const data = await api.post('/api/auth/signup', {
      email,
      password,
      full_name: fullName,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const resetPasswordRequest = async (email) => {
    return await api.post('/api/auth/reset-password-request', { email });
  };

  const resetPassword = async (token, newPassword) => {
    return await api.post('/api/auth/reset-password', {
      token,
      new_password: newPassword,
    });
  };

  const verify2FA = async (code) => {
    const response = await api.post('/api/auth/verify-2fa', { code });
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      setToken(response.access_token);
      await fetchUser();
    }
    return response;
  };

  const setup2FA = async () => {
    return await api.post('/api/auth/setup-2fa', {});
  };

  const enable2FA = async (code) => {
    return await api.post('/api/auth/enable-2fa', { code });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    resetPasswordRequest,
    resetPassword,
    verify2FA,
    setup2FA,
    enable2FA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

