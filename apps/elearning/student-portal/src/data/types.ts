// ============================================
// E-Learning Platform Type Definitions
// Easy to replace with actual API types
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  courseCount: number;
  color: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title?: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  currency: string;
  teacher: Teacher;
  category: Category;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  totalLessons: number;
  totalSections: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  language: string;
  tags: string[];
  requirements: string[];
  objectives: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  hasCertificate: boolean;
  hasDiscussion: boolean;
  lastUpdated: string;
  createdAt: string;
  previewVideoUrl?: string;
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
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number; // in minutes
  order: number;
  isFreePreview: boolean;
  isCompleted?: boolean;
  videoUrl?: string;
  content?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'zip' | 'link';
  url: string;
  size?: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  course: Course;
  userId: string;
  enrolledAt: string;
  progress: number;
  lastAccessedAt: string;
  completedLessons: string[];
  status: 'active' | 'completed' | 'expired';
  certificateId?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'fill_blank' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  maxScore: number;
  passed: boolean;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  instructions: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionType: 'file' | 'text' | 'both';
  allowedFileTypes?: string[];
  maxFileSize?: number;
  requirements?: string[];
  resources?: AssignmentResource[];
  submission?: AssignmentSubmission;
}

export interface AssignmentResource {
  name: string;
  url: string;
  size: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  courseName: string;
  studentName: string;
  teacherName: string;
  completedAt: string;
  certificateUrl: string;
  credentialId: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  teacherResponse?: string;
  teacherResponseAt?: string;
  helpful: number;
}

export interface Discussion {
  id: string;
  courseId: string;
  lessonId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  isTeacherReply: boolean;
}

export interface Note {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  timestamp?: number; // video timestamp in seconds
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  lessonId: string;
  userId: string;
  note?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'course' | 'announcement' | 'grade' | 'deadline' | 'message' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface LearningProgress {
  totalCourses: number;
  completedCourses: number;
  totalHoursLearned: number;
  currentStreak: number;
  longestStreak: number;
  certificates: number;
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  day: string;
  minutes: number;
}

export interface CartItem {
  courseId: string;
  course: Course;
  addedAt: string;
}

export interface Wishlist {
  courseId: string;
  course: Course;
  addedAt: string;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

// Search & Filter types
export interface CourseFilters {
  category?: string;
  level?: string[];
  price?: 'free' | 'paid' | 'all';
  rating?: number;
  duration?: string;
  language?: string;
  sortBy?: 'relevance' | 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high';
}

export interface SearchResult {
  courses: Course[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
