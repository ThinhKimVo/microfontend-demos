import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import MerchantLayout from './layouts/MerchantLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import EventsPage from './pages/public/EventsPage';
import EventDetailPage from './pages/public/EventDetailPage';
import AboutPage from './pages/public/AboutPage';

// Merchant Pages
import MerchantLoginPage from './pages/merchant/LoginPage';
import MerchantRegisterPage from './pages/merchant/RegisterPage';
import MerchantDashboardPage from './pages/merchant/DashboardPage';
import MerchantEventsPage from './pages/merchant/EventsPage';
import SubmitEventPage from './pages/merchant/SubmitEventPage';
import SubscriptionPage from './pages/merchant/SubscriptionPage';

// Admin Pages
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminEventsPage from './pages/admin/EventsPage';
import ApprovalsPage from './pages/admin/ApprovalsPage';
import MerchantsPage from './pages/admin/MerchantsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

function App() {
  const [language, setLanguage] = useState<'en' | 'tc'>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'tc' : 'en'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            element={
              <PublicLayout language={language} onToggleLanguage={toggleLanguage} />
            }
          >
            <Route path="/" element={<HomePage language={language} />} />
            <Route path="/events" element={<EventsPage language={language} />} />
            <Route path="/events/:id" element={<EventDetailPage language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
          </Route>

          {/* Merchant Auth Routes (no layout) */}
          <Route path="/merchant/login" element={<MerchantLoginPage />} />
          <Route path="/merchant/register" element={<MerchantRegisterPage />} />

          {/* Merchant Dashboard Routes */}
          <Route path="/merchant" element={<MerchantLayout />}>
            <Route path="dashboard" element={<MerchantDashboardPage />} />
            <Route path="events" element={<MerchantEventsPage />} />
            <Route path="submit" element={<SubmitEventPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          {/* Admin Auth Routes (no layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="merchants" element={<MerchantsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
