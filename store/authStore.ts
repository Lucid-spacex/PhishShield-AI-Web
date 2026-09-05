import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user: User, token: string) => {
    // Store in sessionStorage (lesser evil vs localStorage for XSS protection)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('access_token');
      const userStr = sessionStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          // Invalid stored data, clear it
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('user');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));