// ============================================
// Admin Portal Type Definitions
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
}

export interface Teacher extends User {
  bio: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  commissionRate: number;
  payoutInfo?: PayoutInfo;
}

export interface PayoutInfo {
  method: 'bank' | 'paypal';
  accountDetails: string;
  pendingAmount: number;
  totalPaid: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  currency: string;
  teacherId: string;
  teacherName: string;
  categoryId: string;
  categoryName: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  totalLessons: number;
  totalSections: number;
  totalStudents: number;
  rating: number;
  totalRatings: number;
  totalRevenue: number;
  isFeatured: boolean;
  createdAt: string;
  publishedAt?: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  courseCount: number;
  order: number;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number;
  order: number;
  isFreePreview: boolean;
  status: 'draft' | 'published';
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
  progress: number;
  lastAccessedAt: string;
  status: 'active' | 'completed' | 'expired';
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  amount: number;
  platformFee: number;
  teacherEarning: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  teacherId: string;
  teacherName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  requestedAt: string;
  processedAt?: string;
}

export interface Review {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'visible' | 'hidden' | 'flagged';
  teacherResponse?: string;
}

export interface TeacherApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  experience: string;
  motivation: string;
  portfolioUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'content' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'expired' | 'disabled';
  applicableCourses: string[] | 'all';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayouts: number;
  pendingApprovals: number;
  activeTickets: number;
}

export interface TeacherDashboardStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayout: number;
  averageRating: number;
  totalReviews: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  enrollments: number;
}
