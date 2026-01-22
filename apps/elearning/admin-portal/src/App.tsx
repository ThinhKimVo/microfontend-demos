import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useMemo } from 'react';
import { User, Teacher } from './data/types';
import { currentTeacher, currentAdmin } from './data/mockData';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from './pages/teacher/TeacherCourses';
import CourseEditor from './pages/teacher/CourseEditor';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import TeacherEarnings from './pages/teacher/TeacherEarnings';
import TeacherReviews from './pages/teacher/TeacherReviews';
import TeacherSettings from './pages/teacher/TeacherSettings';
import TeacherMessages from './pages/teacher/TeacherMessages';
import QuizEditor from './pages/teacher/QuizEditor';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminPayouts from './pages/admin/AdminPayouts';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSupport from './pages/admin/AdminSupport';
import AdminSettings from './pages/admin/AdminSettings';

// Auth Context
interface AuthContextType {
  user: User | Teacher | null;
  role: 'teacher' | 'admin' | null;
  isAuthenticated: boolean;
  login: (user: User | Teacher, role: 'teacher' | 'admin') => void;
  logout: () => void;
  switchRole: (role: 'teacher' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState<User | Teacher | null>(currentTeacher);
  const [role, setRole] = useState<'teacher' | 'admin' | null>('teacher');

  const authValue = useMemo(
    () => ({
      user,
      role,
      isAuthenticated: !!user,
      login: (user: User | Teacher, role: 'teacher' | 'admin') => {
        setUser(user);
        setRole(role);
      },
      logout: () => {
        setUser(null);
        setRole(null);
      },
      switchRole: (newRole: 'teacher' | 'admin') => {
        setRole(newRole);
        setUser(newRole === 'teacher' ? currentTeacher : currentAdmin);
      },
    }),
    [user, role]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/courses/new" element={<CourseEditor />} />
          <Route path="/teacher/courses/:id/edit" element={<CourseEditor />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          <Route path="/teacher/earnings" element={<TeacherEarnings />} />
          <Route path="/teacher/reviews" element={<TeacherReviews />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />
          <Route path="/teacher/quiz/new" element={<QuizEditor />} />
          <Route path="/teacher/quiz/:quizId/edit" element={<QuizEditor />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/payouts" element={<AdminPayouts />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/teacher" replace />} />
        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
