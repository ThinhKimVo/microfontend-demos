import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardBridge from './components/DashboardBridge';
import UsersListBridge from './components/UsersListBridge';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Hopefull Admin Adapter</h1>
              <p className="text-gray-600">Standalone mode - Running on port 3104</p>
              <nav className="mt-4 flex gap-4">
                <a href="/" className="text-primary-600 hover:text-primary-700">Dashboard</a>
                <a href="/users" className="text-primary-600 hover:text-primary-700">Users</a>
              </nav>
            </header>
            <Routes>
              <Route path="/" element={<DashboardBridge />} />
              <Route path="/users" element={<UsersListBridge />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
