import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

interface Admin {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  lastActivity: number | null;
  is2FAEnabled: boolean;
  is2FAVerified: boolean;
  setAuth: (admin: Admin, accessToken: string, rememberMe?: boolean) => void;
  set2FAVerified: (verified: boolean) => void;
  updateActivity: () => void;
  checkSessionExpiry: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      rememberMe: false,
      lastActivity: null,
      is2FAEnabled: false,
      is2FAVerified: false,

      setAuth: (admin, accessToken, rememberMe = false) => {
        set({
          admin,
          accessToken,
          isAuthenticated: true,
          rememberMe,
          lastActivity: Date.now(),
          is2FAVerified: false,
        });
      },

      set2FAVerified: (verified) => {
        set({ is2FAVerified: verified, lastActivity: Date.now() });
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },

      checkSessionExpiry: () => {
        const { lastActivity, rememberMe, isAuthenticated } = get();
        if (!isAuthenticated || !lastActivity) return false;

        // Skip expiry check if remember me is enabled
        if (rememberMe) return true;

        const isExpired = Date.now() - lastActivity > SESSION_TIMEOUT;
        if (isExpired) {
          get().logout();
          return false;
        }
        return true;
      },

      logout: () => {
        set({
          admin: null,
          accessToken: null,
          isAuthenticated: false,
          rememberMe: false,
          lastActivity: null,
          is2FAVerified: false,
        });
      },
    }),
    {
      name: 'healthcare-admin-auth',
    }
  )
);
