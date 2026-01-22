import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { User } from './data/types';
import { currentUser } from './data/mockData';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import LearningLayout from './components/layout/LearningLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Main Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CourseDetailPage from './pages/CourseDetailPage';
import DashboardPage from './pages/DashboardPage';
import MyCoursesPage from './pages/MyCoursesPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

// Learning Pages
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import AssignmentPage from './pages/AssignmentPage';

// Profile Pages
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CertificatesPage from './pages/CertificatesPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';

// Auth Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [user, setUser] = useState<User | null>(currentUser); // Pre-authenticated for demo

  const authValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login: (user: User) => setUser(user),
      logout: () => setUser(null),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/:category" element={<ExplorePage />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>

        {/* Learning Routes */}
        <Route element={<LearningLayout />}>
          <Route path="/learn/:courseSlug" element={<LearnPage />} />
          <Route path="/learn/:courseSlug/:lessonId" element={<LearnPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/assignment/:assignmentId" element={<AssignmentPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
