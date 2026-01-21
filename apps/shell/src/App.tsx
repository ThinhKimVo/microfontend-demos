import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Shell from './components/Layout/Shell';
import Home from './pages/Home';
import ErrorBoundary from './components/RemoteWrapper/ErrorBoundary';

const ReactRemoteWrapper = lazy(() => import('./components/RemoteWrapper/ReactRemoteWrapper'));
const VueRemoteWrapper = lazy(() => import('./components/RemoteWrapper/VueRemoteWrapper'));
const AngularRemoteWrapper = lazy(() => import('./components/RemoteWrapper/AngularRemoteWrapper'));
const HopefullAdapterRemoteWrapper = lazy(() => import('./components/RemoteWrapper/HopefullAdapterRemoteWrapper'));

const Loading = () => (
  <div className="flex items-center justify-center h-64" role="status" aria-label="Loading">
    <div className="motion-safe:animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-hidden="true"></div>
    <span className="sr-only">Loading…</span>
  </div>
);

export default function App() {
  return (
    <Shell>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/react/*" element={<ReactRemoteWrapper />} />
            <Route path="/vue/*" element={<VueRemoteWrapper />} />
            <Route path="/angular/*" element={<AngularRemoteWrapper />} />
            <Route path="/hopefull-adapter/*" element={<HopefullAdapterRemoteWrapper />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Shell>
  );
}
