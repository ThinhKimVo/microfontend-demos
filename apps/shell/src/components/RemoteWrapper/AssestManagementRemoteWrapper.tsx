import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const App = lazy(() => import('assestManagement/App'));

const Loading: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
  </div>
);

const AssestManagementRemoteWrapper: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AssestManagementRemoteWrapper;
