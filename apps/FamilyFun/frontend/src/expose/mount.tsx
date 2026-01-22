import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from '../AppRoutes';
import theme from '../theme/theme';
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
      <MemoryRouter initialEntries={[initialPath]}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </MemoryRouter>
    </React.StrictMode>
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
}
