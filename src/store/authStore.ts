import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../lib/supabase';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        loading: false 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);