import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from '../theme/theme';
import { AuthProvider } from '../contexts/AuthContext';
import AppRoutes from '../AppRoutes';
import '../index.css';

interface MountOptions {
  initialPath?: string;
}

export default function mount(
  el: HTMLElement,
  options: MountOptions = {}
): { unmount: () => void } {
  const { initialPath = '/' } = options;

  const root = ReactDOM.createRoot(el);

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <MemoryRouter initialEntries={[initialPath]}>
              <AppRoutes />
            </MemoryRouter>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </React.StrictMode>
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
}
