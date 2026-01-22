import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enProperty from './locales/en/property.json';
import enBooking from './locales/en/booking.json';
import enAuth from './locales/en/auth.json';
import enHost from './locales/en/host.json';

import arCommon from './locales/ar/common.json';
import arProperty from './locales/ar/property.json';
import arBooking from './locales/ar/booking.json';
import arAuth from './locales/ar/auth.json';
import arHost from './locales/ar/host.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: enCommon,
    property: enProperty,
    booking: enBooking,
    auth: enAuth,
    host: enHost,
  },
  ar: {
    common: arCommon,
    property: arProperty,
    booking: arBooking,
    auth: arAuth,
    host: arHost,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'property', 'booking', 'auth', 'host'],
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;

export const changeLanguage = (lang: 'en' | 'ar') => {
  i18n.changeLanguage(lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export const getCurrentLanguage = () => i18n.language as 'en' | 'ar';

export const isRTL = () => i18n.language === 'ar';
