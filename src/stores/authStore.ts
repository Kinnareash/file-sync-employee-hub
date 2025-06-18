import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'employee' | 'admin';
  status: 'active' | 'inactive';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      setUser: (user: User) => {
        set({ user });
      },

      login: async (username: string, password: string) => {
        // This should now be handled in the component using axios
        return false;
      },

      register: async (username: string, email: string, password: string) => {
        // Should be handled in the component using axios
        return false;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
