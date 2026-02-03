import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UsersList from './pages/users/UsersList';
import TherapistsList from './pages/therapists/TherapistsList';
import AppointmentsList from './pages/appointments/AppointmentsList';
import CategoriesList from './pages/categories/CategoriesList';
import PaymentsList from './pages/payments/PaymentsList';
import Settings from './pages/settings/Settings';
import Support from './pages/support/Support';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, is2FAVerified, is2FAEnabled, checkSessionExpiry, updateActivity } = useAuthStore();
  const navigate = useNavigate();

  // Check session expiry on mount and activity
  useEffect(() => {
    const isValid = checkSessionExpiry();
    if (!isValid && isAuthenticated) {
      navigate('/login');
    }
  }, [checkSessionExpiry, isAuthenticated, navigate]);

  // Update activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      if (isAuthenticated && is2FAVerified) {
        updateActivity();
      }
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [isAuthenticated, is2FAVerified, updateActivity]);

  // Check session expiry periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const isValid = checkSessionExpiry();
      if (!isValid) {
        navigate('/login');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkSessionExpiry, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Require 2FA verification if enabled
  if (is2FAEnabled && !is2FAVerified) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/therapists" element={<TherapistsList />} />
                <Route path="/appointments" element={<AppointmentsList />} />
                <Route path="/categories" element={<CategoriesList />} />
                <Route path="/payments" element={<PaymentsList />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
