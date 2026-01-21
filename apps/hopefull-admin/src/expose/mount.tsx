import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import '../index.css';

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
          <App />
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
