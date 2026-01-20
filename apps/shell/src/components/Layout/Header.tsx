import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/react-demo': 'React Microfrontend',
  '/vue-demo': 'Vue Microfrontend',
  '/angular-demo': 'Angular Microfrontend',
};

export default function Header() {
  const location = useLocation();
  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const title = pageTitles[basePath] || 'Microfrontend Demo';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Port: {getPortForPath(basePath)}
          </span>
          <div
            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
            role="img"
            aria-label="User avatar"
          >
            U
          </div>
        </div>
      </div>
    </header>
  );
}

function getPortForPath(path: string): string {
  const ports: Record<string, string> = {
    '/': '3100 (Shell)',
    '/react-demo': '3101',
    '/vue-demo': '3102',
    '/angular-demo': '3103',
  };
  return ports[path] || '3100';
}
