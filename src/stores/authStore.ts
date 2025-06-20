import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
  register: (username: string, email: string, role: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
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

        login: async () => false,
        register: async () => false,

        logout: () => {
          set({ user: null, token: null, isAuthenticated: false });
        },
      }),
      {
        name: 'auth-storage',
        storage: {
          getItem: (name) => {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    )
  )
);
