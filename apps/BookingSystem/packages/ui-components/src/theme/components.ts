import { Components, Theme } from '@mui/material/styles';

export const getComponents = (direction: 'ltr' | 'rtl'): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        direction,
        scrollBehavior: 'smooth',
      },
      body: {
        backgroundColor: '#F8F9FA',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 8,
        padding: '10px 20px',
        transition: 'all 0.2s ease-in-out',
      },
      contained: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        },
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: '#3D5A80',
        },
      },
      containedSecondary: {
        '&:hover': {
          backgroundColor: '#F2A38A',
        },
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
          backgroundColor: 'rgba(30, 58, 95, 0.04)',
        },
      },
      text: {
        '&:hover': {
          backgroundColor: 'rgba(30, 58, 95, 0.04)',
        },
      },
      sizeLarge: {
        padding: '12px 28px',
        fontSize: '1rem',
      },
      sizeSmall: {
        padding: '6px 14px',
        fontSize: '0.8125rem',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #E8E8E8',
        transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 16,
        '&:last-child': {
          paddingBottom: 16,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#FAFAFA',
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E5E7EB',
          transition: 'border-color 0.2s ease-in-out',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#BDBDBD',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#1E3A5F',
          borderWidth: 2,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: '#64748B',
        '&.Mui-focused': {
          color: '#1E3A5F',
        },
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
        backgroundColor: '#F1F5F9',
        '&:hover': {
          backgroundColor: '#E2E8F0',
        },
      },
      outlined: {
        borderColor: '#E5E7EB',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      },
      elevation2: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      elevation3: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: '#FFFFFF',
        color: '#1A1A2E',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: direction === 'ltr' ? '1px solid #E5E7EB' : 'none',
        borderLeft: direction === 'rtl' ? '1px solid #E5E7EB' : 'none',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        fontWeight: 600,
        padding: '20px 24px',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 48,
      },
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: 48,
        padding: '12px 16px',
        '&.Mui-selected': {
          fontWeight: 600,
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
      standardSuccess: {
        backgroundColor: '#E8F5E9',
        color: '#1B5E20',
      },
      standardError: {
        backgroundColor: '#FFEBEE',
        color: '#C62828',
      },
      standardWarning: {
        backgroundColor: '#FFF3E0',
        color: '#E65100',
      },
      standardInfo: {
        backgroundColor: '#E3F2FD',
        color: '#01579B',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: '#E0E0E0',
        color: '#757575',
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 600,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#1A1A2E',
        fontSize: '0.75rem',
        borderRadius: 6,
        padding: '8px 12px',
      },
      arrow: {
        color: '#1A1A2E',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: '#E5E7EB',
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: '#F1F5F9',
      },
    },
  },
  MuiRating: {
    styleOverrides: {
      iconFilled: {
        color: '#FFB400',
      },
      iconHover: {
        color: '#FFC940',
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 46,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 2,
        '&.Mui-checked': {
          transform: direction === 'ltr' ? 'translateX(20px)' : 'translateX(-20px)',
          '& + .MuiSwitch-track': {
            backgroundColor: '#1E3A5F',
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 22,
        height: 22,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      },
      track: {
        borderRadius: 13,
        backgroundColor: '#E5E7EB',
        opacity: 1,
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: {
        height: 6,
      },
      thumb: {
        width: 20,
        height: 20,
        '&:hover, &.Mui-focusVisible': {
          boxShadow: '0 0 0 8px rgba(30, 58, 95, 0.16)',
        },
      },
      track: {
        borderRadius: 3,
      },
      rail: {
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
      },
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: '#1E3A5F',
      },
    },
  },
});
