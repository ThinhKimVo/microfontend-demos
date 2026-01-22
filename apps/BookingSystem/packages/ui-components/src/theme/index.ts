import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { palette, extendedColors } from './palette';
import { getTypography } from './typography';
import { getComponents } from './components';

export { getEmotionCache, createRTLCache, createLTRCache } from './rtl';
export { palette, extendedColors };

// Breakpoints configuration
// Mobile: < 600px
// Tablet: 600px - 1024px
// Desktop: > 1024px
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1024,
    lg: 1280,
    xl: 1536,
  },
};

// Create theme based on direction
export const createAppTheme = (direction: 'ltr' | 'rtl' = 'ltr'): Theme => {
  const themeOptions: ThemeOptions = {
    direction,
    palette,
    typography: getTypography(direction),
    breakpoints,
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: getComponents(direction),
  };

  return createTheme(themeOptions);
};

// Pre-created themes for convenience
export const lightTheme = createAppTheme('ltr');
export const lightThemeRTL = createAppTheme('rtl');

// Default export
export default createAppTheme;

// Type augmentation for custom theme properties
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}
