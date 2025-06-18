
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
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // This will be replaced with actual authentication when Supabase is connected
        const mockUser: User = {
          id: '1',
          username,
          email: `${username}@company.com`,
          role: username === 'admin' ? 'admin' : 'employee',
          status: 'active'
        };
        
        set({ user: mockUser, isAuthenticated: true });
        return true;
      },
      register: async (username: string, email: string, password: string) => {
        // This will be replaced with actual registration when Supabase is connected
        // For now, just return success
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
