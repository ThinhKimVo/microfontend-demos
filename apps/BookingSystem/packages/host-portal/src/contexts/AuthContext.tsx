import React, { createContext, useContext, useState, useCallback } from 'react';
import { Host } from '@staygcc/shared/types';
import { mockHosts } from '@staygcc/shared/mock-data';

interface AuthContextType {
  host: Host | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Host>) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  phone: string;
  phoneCountryCode: string;
  password: string;
  firstNameEn: string;
  lastNameEn: string;
  businessName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'staygcc-host-auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [host, setHost] = useState<Host | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock login - find host by email
      const foundHost = mockHosts.find((h) => h.email === email);
      if (foundHost) {
        setHost(foundHost);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundHost));
        return true;
      }

      // For demo, use first mock host
      const mockHost = mockHosts[0];
      setHost(mockHost);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockHost));
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newHost: Host = {
        id: `host-${Date.now()}`,
        email: data.email,
        phone: data.phone,
        phoneCountryCode: data.phoneCountryCode,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        firstNameAr: '',
        lastNameAr: '',
        preferredLanguage: 'en',
        preferredCurrency: 'SAR',
        idVerificationStatus: 'none',
        isHost: true,
        isGuest: false,
        isSuperhost: false,
        hostingSince: new Date().toISOString(),
        totalListings: 0,
        totalReviews: 0,
        averageRating: 0,
        responseRate: 100,
        responseTime: '1 hour',
        businessName: data.businessName,
        languagesSpoken: ['en', 'ar'],
        verificationBadges: [],
        tourismLicenseVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };

      setHost(newHost);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newHost));
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setHost(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (data: Partial<Host>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (host) {
        const updatedHost = { ...host, ...data, updatedAt: new Date().toISOString() };
        setHost(updatedHost);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedHost));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [host]);

  const value: AuthContextType = {
    host,
    isAuthenticated: !!host,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
