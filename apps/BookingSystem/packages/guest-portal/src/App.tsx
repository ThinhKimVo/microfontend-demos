import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { createAppTheme, getEmotionCache } from '@staygcc/ui-components';
import { LocaleProvider } from './contexts/LocaleContext';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { WishlistProvider } from './contexts/WishlistContext';
import MainLayout from './components/layout/MainLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Search & Property Pages
import SearchPage from './pages/search/SearchPage';
import PropertyDetailPage from './pages/property/PropertyDetailPage';

// Booking Pages
import BookingPage from './pages/booking/BookingPage';

// User Pages
import TripsPage from './pages/trips/TripsPage';
import WishlistsPage from './pages/wishlists/WishlistsPage';
import MessagesPage from './pages/messages/MessagesPage';
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
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Search & Property */}
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

            {/* Booking */}
            <Route path="/booking/:propertyId" element={<BookingPage />} />

            {/* User Pages */}
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/wishlists" element={<WishlistsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  );
}

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <SearchProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </SearchProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;
