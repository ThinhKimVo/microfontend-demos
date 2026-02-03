import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import '../index.css';

interface MountOptions {
  initialPath?: string;
}

export default function mount(el: HTMLElement, options: MountOptions = {}) {
  const root = ReactDOM.createRoot(el);

  root.render(
    <React.StrictMode>
      <MemoryRouter initialEntries={[options.initialPath || '/']}>
        <App />
      </MemoryRouter>
    </React.StrictMode>
  );

  return {
    unmount: () => root.unmount(),
  };
}
