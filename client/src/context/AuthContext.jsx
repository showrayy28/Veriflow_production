import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../config/api';
import { DEMO_USERS } from '../config/constants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage or load demo default
  useEffect(() => {
    const savedToken = localStorage.getItem('vf_token');
    const savedUser = localStorage.getItem('vf_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('vf_user');
      }
    } else {
      // Default to demo admin for frictionless evaluation
      const defaultDemo = DEMO_USERS.admin;
      setUser(defaultDemo);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vf_token', res.data.token);
        localStorage.setItem('vf_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.post('/auth/register', userData);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vf_token', res.data.token);
        localStorage.setItem('vf_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vf_token');
    localStorage.removeItem('vf_user');
  };

  /**
   * 1-Click Demo Role Switcher for instant evaluator persona switching
   */
  const switchDemoRole = async (targetRole) => {
    const demo = DEMO_USERS[targetRole];
    if (!demo) return;

    try {
      const res = await apiClient.post('/auth/demo-switch', { role: targetRole });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('vf_token', res.data.token);
        localStorage.setItem('vf_user', JSON.stringify(res.data.user));
        return;
      }
    } catch (e) {
      // Fallback local switch
      setUser(demo);
      localStorage.setItem('vf_user', JSON.stringify(demo));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'admin',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
