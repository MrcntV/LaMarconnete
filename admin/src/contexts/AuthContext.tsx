import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AuthState } from '../types';
import { apiPost } from '../api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AdminUser;
        setState({ user, token, loading: false });
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setState({ user: null, token: null, loading: false });
      }
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiPost('/api/auth/admin/login', { email, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setState({ user: null, token: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
