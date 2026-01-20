import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DashboardBridge from '../components/DashboardBridge';
import UsersListBridge from '../components/UsersListBridge';
import '../styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/" element={<DashboardBridge />} />
            <Route path="/users" element={<UsersListBridge />} />
            <Route path="*" element={<DashboardBridge />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
}
