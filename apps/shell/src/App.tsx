import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Shell from './components/Layout/Shell';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import ErrorBoundary from './components/RemoteWrapper/ErrorBoundary';

const HopefullAdminRemoteWrapper = lazy(() => import('./components/RemoteWrapper/HopefullAdminRemoteWrapper'));
const AssestManagementRemoteWrapper = lazy(() => import('./components/RemoteWrapper/AssestManagementRemoteWrapper'));
const CmmsRemoteWrapper = lazy(() => import('./components/RemoteWrapper/CmmsRemoteWrapper'));
const FamilyFunRemoteWrapper = lazy(() => import('./components/RemoteWrapper/FamilyFunRemoteWrapper'));
const BookingGuestPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/BookingGuestPortalRemoteWrapper'));
const BookingHostPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/BookingHostPortalRemoteWrapper'));
const ElearningAdminPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/ElearningAdminPortalRemoteWrapper'));
const ElearningStudentPortalRemoteWrapper = lazy(() => import('./components/RemoteWrapper/ElearningStudentPortalRemoteWrapper'));

const FullPageLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50" role="status" aria-label="Loading">
    <div className="motion-safe:animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-hidden="true"></div>
    <span className="sr-only">Loading…</span>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Home page with Shell layout */}
        <Route path="/" element={
          <Shell>
            <Home />
          </Shell>
        } />

        {/* App detail page */}
        <Route path="/app/:appId" element={<AppDetail />} />

        {/* Full-page remote apps - no Shell constraint */}
        <Route path="/hopefull-admin/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <HopefullAdminRemoteWrapper />
          </Suspense>
        } />
        <Route path="/assest-management/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <AssestManagementRemoteWrapper />
          </Suspense>
        } />
        <Route path="/cmms/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <CmmsRemoteWrapper />
          </Suspense>
        } />
        <Route path="/family-fun/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <FamilyFunRemoteWrapper />
          </Suspense>
        } />
        <Route path="/booking-guest-portal/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <BookingGuestPortalRemoteWrapper />
          </Suspense>
        } />
        <Route path="/booking-host-portal/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <BookingHostPortalRemoteWrapper />
          </Suspense>
        } />
        <Route path="/elearning-admin-portal/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <ElearningAdminPortalRemoteWrapper />
          </Suspense>
        } />
        <Route path="/elearning-student-portal/*" element={
          <Suspense fallback={<FullPageLoading />}>
            <ElearningStudentPortalRemoteWrapper />
          </Suspense>
        } />
      </Routes>
    </ErrorBoundary>
  );
}
