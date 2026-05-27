import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../../services/authService';
import { setAccessToken, clearAccessToken, getAccessToken } from '../../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from stored token
  useEffect(() => {
    const restore = async () => {
      const token = getAccessToken();
      if (!token) { setLoading(false); return; }
      try {
        // authService.me() returns { success, message, data: user }
        const res = await authService.me();
        setUser(res.data);
      } catch {
        clearAccessToken();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // Forced logout from axios interceptor
  useEffect(() => {
    const handle = () => { setUser(null); clearAccessToken(); };
    window.addEventListener('auth:logout', handle);
    return () => window.removeEventListener('auth:logout', handle);
  }, []);

  const login = useCallback(async (email, password) => {
    // res = { success, message, data: { user, accessToken } }
    const res = await authService.login(email, password);
    const { user: userData, accessToken } = res.data;
    setAccessToken(accessToken);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authService.register(name, email, password);
    const { user: userData, accessToken } = res.data;
    setAccessToken(accessToken);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearAccessToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
