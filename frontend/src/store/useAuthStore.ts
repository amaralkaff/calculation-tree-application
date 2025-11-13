import { create } from 'zustand';
import { api } from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.login(username, password);
      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Login failed',
        loading: false,
      });
      throw error;
    }
  },

  register: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.register(username, password);
      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Registration failed',
        loading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await api.getMe();
      set({
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));
