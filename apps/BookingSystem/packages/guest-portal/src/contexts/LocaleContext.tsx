import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Language, Currency } from '@staygcc/shared/types';

interface LocaleContextType {
  language: Language;
  currency: Currency;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  toggleLanguage: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'staygcc-locale';

interface LocalePreferences {
  language: Language;
  currency: Currency;
}

const getStoredPreferences = (): LocalePreferences => {
  if (typeof window === 'undefined') {
    return { language: 'en', currency: 'SAR' };
  }
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { language: 'en', currency: 'SAR' };
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useState<LocalePreferences>(getStoredPreferences);

  const setLanguage = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language);
      setPreferences((prev) => {
        const newPrefs = { ...prev, language };
        localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(newPrefs));
        return newPrefs;
      });
    },
    [i18n]
  );

  const setCurrency = useCallback((currency: Currency) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, currency };
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(newPrefs));
      return newPrefs;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLanguage = preferences.language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  }, [preferences.language, setLanguage]);

  // Initialize language on mount
  useEffect(() => {
    if (preferences.language !== i18n.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, []);

  const value: LocaleContextType = {
    language: preferences.language,
    currency: preferences.currency,
    isRTL: preferences.language === 'ar',
    setLanguage,
    setCurrency,
    toggleLanguage,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export default LocaleContext;
