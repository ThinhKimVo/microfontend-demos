// ============================================
// API Service Layer - Easy to Replace with Real API
// Replace these functions with actual API calls
// ============================================

import {
  User,
  Category,
  Course,
  Section,
  Enrollment,
  Certificate,
  Review,
  Discussion,
  Notification,
  LearningProgress,
  Quiz,
  QuizAttempt,
  Assignment,
  CourseFilters,
  SearchResult,
  CartItem,
  Wishlist,
} from './types';

import {
  currentUser,
  categories,
  courses,
  courseSections,
  enrollments,
  certificates,
  reviews,
  discussions,
  notifications,
  learningProgress,
  quizzes,
  quizAttempts,
  assignments,
  cartItems,
  wishlistItems,
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// Authentication API
// ============================================
export const authApi = {
  async login(email: string, _password: string): Promise<User> {
    await delay(800);
    if (email === 'demo@example.com') {
      return currentUser;
    }
    return currentUser;
  },

  async register(data: { email: string; password: string; firstName: string; lastName: string }): Promise<User> {
    await delay(1000);
    return { ...currentUser, email: data.email, firstName: data.firstName, lastName: data.lastName };
  },

  async logout(): Promise<void> {
    await delay(500);
  },

  async resetPassword(_email: string): Promise<void> {
    await delay(800);
  },

  async getCurrentUser(): Promise<User> {
    await delay(300);
    return currentUser;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(600);
    return { ...currentUser, ...data };
  },
};

// ============================================
// Categories API
// ============================================
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    await delay(300);
    return categories;
  },

  async getById(id: string): Promise<Category | undefined> {
    await delay(200);
    return categories.find(c => c.id === id);
  },

  async getBySlug(slug: string): Promise<Category | undefined> {
    await delay(200);
    return categories.find(c => c.slug === slug);
  },
};

// ============================================
// Courses API
// ============================================
export const coursesApi = {
  async getAll(filters?: CourseFilters): Promise<Course[]> {
    await delay(500);
    let result = [...courses];

    if (filters?.category) {
      result = result.filter(c => c.category.slug === filters.category);
    }
    if (filters?.level && filters.level.length > 0) {
      result = result.filter(c => filters.level!.includes(c.level));
    }
    if (filters?.price === 'free') {
      result = result.filter(c => c.price === 0);
    } else if (filters?.price === 'paid') {
      result = result.filter(c => c.price > 0);
    }
    if (filters?.rating) {
      result = result.filter(c => c.rating >= filters.rating!);
    }

    // Sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'popular':
          result.sort((a, b) => b.totalStudents - a.totalStudents);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
      }
    }

    return result;
  },

  async search(query: string, filters?: CourseFilters): Promise<SearchResult> {
    await delay(600);
    const lowerQuery = query.toLowerCase();
    let result = courses.filter(
      c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        c.teacher.name.toLowerCase().includes(lowerQuery)
    );

    if (filters) {
      if (filters.category) {
        result = result.filter(c => c.category.slug === filters.category);
      }
      if (filters.level && filters.level.length > 0) {
        result = result.filter(c => filters.level!.includes(c.level));
      }
    }

    return {
      courses: result,
      total: result.length,
      page: 1,
      pageSize: 20,
      hasMore: false,
    };
  },

  async getById(id: string): Promise<Course | undefined> {
    await delay(300);
    return courses.find(c => c.id === id);
  },

  async getBySlug(slug: string): Promise<Course | undefined> {
    await delay(300);
    return courses.find(c => c.slug === slug);
  },

  async getFeatured(): Promise<Course[]> {
    await delay(400);
    return courses.filter(c => c.isFeatured);
  },

  async getPopular(): Promise<Course[]> {
    await delay(400);
    return [...courses].sort((a, b) => b.totalStudents - a.totalStudents).slice(0, 8);
  },

  async getNew(): Promise<Course[]> {
    await delay(400);
    return courses.filter(c => c.isNew);
  },

  async getBestsellers(): Promise<Course[]> {
    await delay(400);
    return courses.filter(c => c.isBestseller);
  },

  async getRecommended(_userId: string): Promise<Course[]> {
    await delay(500);
    return courses.slice(0, 6);
  },

  async getByCategory(categorySlug: string): Promise<Course[]> {
    await delay(400);
    return courses.filter(c => c.category.slug === categorySlug);
  },

  async getSections(courseId: string): Promise<Section[]> {
    await delay(400);
    return courseSections.filter(s => s.courseId === courseId);
  },

  async getReviews(courseId: string): Promise<Review[]> {
    await delay(300);
    return reviews.filter(r => r.courseId === courseId);
  },

  async getDiscussions(courseId: string): Promise<Discussion[]> {
    await delay(300);
    return discussions.filter(d => d.courseId === courseId);
  },
};

// ============================================
// Enrollments API
// ============================================
export const enrollmentsApi = {
  async getAll(userId: string): Promise<Enrollment[]> {
    await delay(400);
    return enrollments.filter(e => e.userId === userId);
  },

  async getById(id: string): Promise<Enrollment | undefined> {
    await delay(200);
    return enrollments.find(e => e.id === id);
  },

  async getByCourse(userId: string, courseId: string): Promise<Enrollment | undefined> {
    await delay(200);
    return enrollments.find(e => e.userId === userId && e.courseId === courseId);
  },

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    await delay(800);
    const course = courses.find(c => c.id === courseId)!;
    const newEnrollment: Enrollment = {
      id: `enroll-${Date.now()}`,
      courseId,
      course,
      userId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      lastAccessedAt: new Date().toISOString(),
      completedLessons: [],
      status: 'active',
    };
    return newEnrollment;
  },

  async updateProgress(enrollmentId: string, lessonId: string): Promise<Enrollment> {
    await delay(300);
    const enrollment = enrollments.find(e => e.id === enrollmentId)!;
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    return enrollment;
  },
};

// ============================================
// Certificates API
// ============================================
export const certificatesApi = {
  async getAll(userId: string): Promise<Certificate[]> {
    await delay(400);
    return certificates.filter(c => c.userId === userId);
  },

  async getById(id: string): Promise<Certificate | undefined> {
    await delay(200);
    return certificates.find(c => c.id === id);
  },

  async download(_id: string): Promise<Blob> {
    await delay(1000);
    // In a real app, this would return the actual PDF blob
    return new Blob(['Certificate PDF content'], { type: 'application/pdf' });
  },
};

// ============================================
// Assessments API
// ============================================
export const assessmentsApi = {
  async getQuiz(lessonId: string): Promise<Quiz | undefined> {
    await delay(300);
    return quizzes.find(q => q.lessonId === lessonId);
  },

  async getQuizAttempts(quizId: string, userId: string): Promise<QuizAttempt[]> {
    await delay(300);
    return quizAttempts.filter(a => a.quizId === quizId && a.userId === userId);
  },

  async submitQuiz(quizId: string, answers: { questionId: string; answer: string | string[] }[]): Promise<QuizAttempt> {
    await delay(1000);
    const quiz = quizzes.find(q => q.id === quizId)!;
    let score = 0;
    const gradedAnswers = answers.map(a => {
      const question = quiz.questions.find(q => q.id === a.questionId)!;
      const isCorrect = Array.isArray(question.correctAnswer)
        ? JSON.stringify(question.correctAnswer.sort()) === JSON.stringify((a.answer as string[]).sort())
        : question.correctAnswer === a.answer;
      const points = isCorrect ? question.points : 0;
      score += points;
      return { ...a, isCorrect, points };
    });

    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    return {
      id: `attempt-${Date.now()}`,
      quizId,
      userId: currentUser.id,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      score,
      maxScore,
      passed: (score / maxScore) * 100 >= quiz.passingScore,
      answers: gradedAnswers,
    };
  },

  async getAssignment(lessonId: string): Promise<Assignment | undefined> {
    await delay(300);
    return assignments.find(a => a.lessonId === lessonId);
  },

  async submitAssignment(_assignmentId: string, _data: { content?: string; file?: File }): Promise<void> {
    await delay(1500);
  },
};

// ============================================
// Notifications API
// ============================================
export const notificationsApi = {
  async getAll(userId: string): Promise<Notification[]> {
    await delay(300);
    return notifications.filter(n => n.userId === userId);
  },

  async markAsRead(id: string): Promise<void> {
    await delay(200);
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay(300);
    notifications.filter(n => n.userId === userId).forEach(n => {
      n.isRead = true;
    });
  },

  async getUnreadCount(userId: string): Promise<number> {
    await delay(100);
    return notifications.filter(n => n.userId === userId && !n.isRead).length;
  },
};

// ============================================
// Progress API
// ============================================
export const progressApi = {
  async getLearningProgress(_userId: string): Promise<LearningProgress> {
    await delay(400);
    return learningProgress;
  },
};

// ============================================
// Cart API
// ============================================
export const cartApi = {
  async getItems(): Promise<CartItem[]> {
    await delay(300);
    return cartItems;
  },

  async addItem(courseId: string): Promise<CartItem> {
    await delay(500);
    const course = courses.find(c => c.id === courseId)!;
    const item = { courseId, course, addedAt: new Date().toISOString() };
    return item;
  },

  async removeItem(_courseId: string): Promise<void> {
    await delay(300);
  },

  async applyCoupon(_code: string): Promise<{ discount: number; message: string }> {
    await delay(500);
    return { discount: 20, message: '20% discount applied!' };
  },
};

// ============================================
// Wishlist API
// ============================================
export const wishlistApi = {
  async getItems(): Promise<Wishlist[]> {
    await delay(300);
    return wishlistItems;
  },

  async addItem(courseId: string): Promise<Wishlist> {
    await delay(500);
    const course = courses.find(c => c.id === courseId)!;
    return { courseId, course, addedAt: new Date().toISOString() };
  },

  async removeItem(_courseId: string): Promise<void> {
    await delay(300);
  },
};
