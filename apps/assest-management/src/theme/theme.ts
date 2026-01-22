import { createTheme, alpha } from '@mui/material/styles';
import './mui.d.ts';

// Minimals-inspired color palette
const PRIMARY = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: '#1C252E',
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

const GREY = {
  50: '#FCFDFD',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#1C252E',
  900: '#141A21',
};

// Custom shadows following Minimals style
const customShadows = {
  z1: '0 1px 2px 0 rgba(145, 158, 171, 0.16)',
  z4: '0 4px 8px 0 rgba(145, 158, 171, 0.16)',
  z8: '0 8px 16px 0 rgba(145, 158, 171, 0.16)',
  z12: '0 12px 24px -4px rgba(145, 158, 171, 0.16)',
  z16: '0 16px 32px -4px rgba(145, 158, 171, 0.16)',
  z20: '0 20px 40px -4px rgba(145, 158, 171, 0.16)',
  z24: '0 24px 48px 0 rgba(145, 158, 171, 0.16)',
  card: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
  dialog: '-40px 40px 80px -8px rgba(145, 158, 171, 0.24)',
  dropdown: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)',
  primary: `0 8px 16px 0 ${alpha(PRIMARY.main, 0.24)}`,
  info: `0 8px 16px 0 ${alpha(INFO.main, 0.24)}`,
  success: `0 8px 16px 0 ${alpha(SUCCESS.main, 0.24)}`,
  warning: `0 8px 16px 0 ${alpha(WARNING.main, 0.24)}`,
  error: `0 8px 16px 0 ${alpha(ERROR.main, 0.24)}`,
  secondary: `0 8px 16px 0 ${alpha(SECONDARY.main, 0.24)}`,
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    divider: alpha(GREY[500], 0.2),
    action: {
      hover: alpha(GREY[500], 0.08),
      selected: alpha(GREY[500], 0.16),
      disabled: alpha(GREY[500], 0.8),
      disabledBackground: alpha(GREY[500], 0.24),
      focus: alpha(GREY[500], 0.24),
    },
  },
  typography: {
    fontFamily: '"Public Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          fontWeight: 700,
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          height: 48,
          padding: '8px 22px',
        },
        sizeMedium: {
          height: 40,
        },
        sizeSmall: {
          height: 32,
          padding: '4px 10px',
        },
        contained: {
          '&:hover': {
            boxShadow: customShadows.z8,
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: PRIMARY.dark,
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        outlinedInherit: {
          borderColor: alpha(GREY[500], 0.32),
          '&:hover': {
            backgroundColor: alpha(GREY[500], 0.08),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(GREY[500], 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: customShadows.card,
          border: 'none',
          position: 'relative',
          zIndex: 0,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px 24px 0',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 700,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: customShadows.z1,
        },
        elevation4: {
          boxShadow: customShadows.z4,
        },
        elevation8: {
          boxShadow: customShadows.z8,
        },
        elevation12: {
          boxShadow: customShadows.z12,
        },
        elevation16: {
          boxShadow: customShadows.z16,
        },
        elevation20: {
          boxShadow: customShadows.z20,
        },
        elevation24: {
          boxShadow: customShadows.z24,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          backdropFilter: 'blur(6px)',
          backgroundColor: alpha('#FFFFFF', 0.8),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          backgroundImage: 'none',
          boxShadow: customShadows.z16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: alpha(GREY[500], 0.32),
            },
            '&:hover fieldset': {
              borderColor: GREY[500],
            },
            '&.Mui-focused fieldset': {
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          '&.MuiChip-colorDefault': {
            backgroundColor: alpha(GREY[500], 0.16),
          },
        },
        outlined: {
          borderColor: alpha(GREY[500], 0.32),
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
        },
        colorDefault: {
          backgroundColor: GREY[300],
          color: GREY[600],
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: GREY[600],
            backgroundColor: GREY[100],
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(GREY[500], 0.04),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha(GREY[500], 0.16)}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: customShadows.dialog,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 0',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 24,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardInfo: {
          backgroundColor: alpha(INFO.main, 0.08),
          color: INFO.dark,
        },
        standardSuccess: {
          backgroundColor: alpha(SUCCESS.main, 0.08),
          color: SUCCESS.dark,
        },
        standardWarning: {
          backgroundColor: alpha(WARNING.main, 0.08),
          color: WARNING.dark,
        },
        standardError: {
          backgroundColor: alpha(ERROR.main, 0.08),
          color: ERROR.dark,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: GREY[800],
          borderRadius: 8,
        },
        arrow: {
          color: GREY[800],
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(GREY[500], 0.12),
        },
        rectangular: {
          borderRadius: 12,
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: alpha(GREY[500], 0.24),
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY.main, 0.08),
            '&:hover': {
              backgroundColor: alpha(PRIMARY.main, 0.16),
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: 1,
        },
      },
    },
  },
});

// Export custom shadows for use in components
export { customShadows, PRIMARY, SECONDARY, INFO, SUCCESS, WARNING, ERROR, GREY };

export default theme;
