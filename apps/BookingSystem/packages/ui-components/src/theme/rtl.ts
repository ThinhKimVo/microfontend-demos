import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// Create Emotion cache for RTL
export const createRTLCache = () =>
  createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

// Create Emotion cache for LTR
export const createLTRCache = () =>
  createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer],
  });

// Get appropriate cache based on direction
export const getEmotionCache = (direction: 'ltr' | 'rtl') => {
  return direction === 'rtl' ? createRTLCache() : createLTRCache();
};
