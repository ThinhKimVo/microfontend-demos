import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import '@staygcc/shared/i18n';

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
        <App />
      </MemoryRouter>
    </React.StrictMode>
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
}
