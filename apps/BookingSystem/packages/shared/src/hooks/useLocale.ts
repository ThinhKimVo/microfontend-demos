import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from './useLocalStorage';
import { Language, Currency } from '../types';

interface LocalePreferences {
  language: Language;
  currency: Currency;
}

const DEFAULT_PREFERENCES: LocalePreferences = {
  language: 'en',
  currency: 'SAR',
};

export function useLocale() {
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useLocalStorage<LocalePreferences>(
    'staygcc-locale',
    DEFAULT_PREFERENCES
  );

  const setLanguage = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      setPreferences((prev) => ({ ...prev, language }));
    },
    [i18n, setPreferences]
  );

  const setCurrency = useCallback(
    (currency: Currency) => {
      setPreferences((prev) => ({ ...prev, currency }));
    },
    [setPreferences]
  );

  const toggleLanguage = useCallback(() => {
    const newLanguage = preferences.language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  }, [preferences.language, setLanguage]);

  // Initialize language on mount
  useEffect(() => {
    if (preferences.language !== i18n.language) {
      setLanguage(preferences.language);
    }
  }, []);

  return {
    language: preferences.language,
    currency: preferences.currency,
    isRTL: preferences.language === 'ar',
    setLanguage,
    setCurrency,
    toggleLanguage,
  };
}

export default useLocale;
