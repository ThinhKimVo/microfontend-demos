import { PaletteOptions } from '@mui/material/styles';

// Clean, modern color palette without gradients
export const palette: PaletteOptions = {
  primary: {
    main: '#1E3A5F',
    light: '#3D5A80',
    dark: '#0D1B2A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#E07A5F',
    light: '#F2A38A',
    dark: '#C75B3F',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#64748B',
    disabled: '#9CA3AF',
  },
  divider: '#E5E7EB',
  action: {
    active: '#1E3A5F',
    hover: 'rgba(30, 58, 95, 0.04)',
    selected: 'rgba(30, 58, 95, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(30, 58, 95, 0.12)',
  },
};

// Additional semantic colors for the booking platform
export const extendedColors = {
  superhost: '#FF385C',
  verified: '#008A05',
  instantBook: '#428BCA',
  familyOnly: '#9C27B0',
  rating: '#FFB400',
  priceHighlight: '#E07A5F',
};
