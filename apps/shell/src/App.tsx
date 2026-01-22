import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Shell from './components/Layout/Shell';
import Home from './pages/Home';
import ErrorBoundary from './components/RemoteWrapper/ErrorBoundary';

const HopefullAdminRemoteWrapper = lazy(() => import('./components/RemoteWrapper/HopefullAdminRemoteWrapper'));
const AssestManagementRemoteWrapper = lazy(() => import('./components/RemoteWrapper/AssestManagementRemoteWrapper'));
const CmmsRemoteWrapper = lazy(() => import('./components/RemoteWrapper/CmmsRemoteWrapper'));
const FamilyFunRemoteWrapper = lazy(() => import('./components/RemoteWrapper/FamilyFunRemoteWrapper'));
const BookingGuestPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/BookingGuestPortalRemoteWrapper'));
const BookingHostPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/BookingHostPortalRemoteWrapper'));
const ElearningAdminPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/ElearningAdminPortalRemoteWrapper'));
const ElearningStudentPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/ElearningStudentPortalRemoteWrapper'));

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
            <Route path="/hopefull-admin/*" element={<HopefullAdminRemoteWrapper />} />
            <Route path="/assest-management/*" element={<AssestManagementRemoteWrapper />} />
            <Route path="/cmms/*" element={<CmmsRemoteWrapper />} />
            <Route path="/family-fun/*" element={<FamilyFunRemoteWrapper />} />
            <Route path="/booking-guest-portal/*" element={<BookingGuestPortalRemoteWrapper />} />
            <Route path="/booking-host-portal/*" element={<BookingHostPortalRemoteWrapper />} />
            <Route path="/elearning-admin-portal/*" element={<ElearningAdminPortalRemoteWrapper />} />
            <Route path="/elearning-student-portal/*" element={<ElearningStudentPortalRemoteWrapper />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Shell>
  );
}
