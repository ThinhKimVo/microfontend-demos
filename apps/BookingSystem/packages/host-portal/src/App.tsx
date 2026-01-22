import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { createAppTheme, getEmotionCache } from '@staygcc/ui-components';
import { LocaleProvider } from './contexts/LocaleContext';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Listings Pages
import ListingsPage from './pages/listings/ListingsPage';
import CreateListingPage from './pages/listings/CreateListingPage';

// Calendar Page
import CalendarPage from './pages/calendar/CalendarPage';

// Bookings Pages
import BookingsPage from './pages/bookings/BookingsPage';

// Earnings Page
import EarningsPage from './pages/earnings/EarningsPage';

// Messages Page
import MessagesPage from './pages/messages/MessagesPage';

// Reviews Page
import ReviewsPage from './pages/reviews/ReviewsPage';

// Profile Page
import ProfilePage from './pages/profile/ProfilePage';

function AppContent() {
  const { i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const theme = useMemo(() => createAppTheme(direction), [direction]);
  const emotionCache = useMemo(() => getEmotionCache(direction), [direction]);

  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/new" element={<CreateListingPage />} />
            <Route path="/listings/:id/edit" element={<CreateListingPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/earnings" element={<EarningsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  );
}

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;
