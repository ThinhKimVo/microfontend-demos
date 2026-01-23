export interface AppFeature {
  name: string;
  description: string;
}

export interface AppInfo {
  id: string;
  name: string;
  path: string;
  framework: string;
  port: number;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  description: string;
  longDescription: string;
  features: AppFeature[];
  version: string;
  lastUpdated: string;
}

export const apps: AppInfo[] = [
  {
    id: 'hopefull-admin',
    name: 'Hopefull Admin',
    path: '/hopefull-admin',
    framework: 'React',
    port: 3101,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'Hopefull Admin dashboard microfrontend',
    longDescription: 'A comprehensive admin dashboard for managing Hopefull platform. Includes user management, analytics, and system configuration tools.',
    features: [
      { name: 'Dashboard', description: 'Overview of key metrics and KPIs' },
      { name: 'Users', description: 'User management and role assignment' },
      { name: 'Analytics', description: 'Detailed reports and data visualization' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'assest-management',
    name: 'Asset Management',
    path: '/assest-management',
    framework: 'React',
    port: 3102,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'Asset Management microfrontend',
    longDescription: 'Enterprise asset management solution for tracking, maintaining, and optimizing organizational assets throughout their lifecycle.',
    features: [
      { name: 'Asset Tracking', description: 'Real-time location and status monitoring' },
      { name: 'Maintenance', description: 'Scheduled and preventive maintenance management' },
      { name: 'Reports', description: 'Asset utilization and depreciation reports' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'cmms',
    name: 'CMMS',
    path: '/cmms',
    framework: 'React',
    port: 3103,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'Computerized Maintenance Management System',
    longDescription: 'Full-featured CMMS for facilities and equipment maintenance. Manage work orders, preventive maintenance schedules, inventory, and technician assignments.',
    features: [
      { name: 'Work Orders', description: 'Create, assign, and track maintenance tasks' },
      { name: 'Preventive Maintenance', description: 'Schedule recurring maintenance activities' },
      { name: 'Inventory', description: 'Parts and supplies inventory management' },
      { name: 'Technicians', description: 'Workforce scheduling and performance tracking' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'family-fun',
    name: 'FamilyFun',
    path: '/family-fun',
    framework: 'React',
    port: 3104,
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    description: 'Family events and activities platform',
    longDescription: 'Discover and book family-friendly events and activities. Features merchant portal for event organizers and admin tools for platform management.',
    features: [
      { name: 'Events', description: 'Browse and book family activities' },
      { name: 'Merchant Portal', description: 'Event organizer management dashboard' },
      { name: 'Admin', description: 'Platform administration and moderation' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'booking-guest-portal',
    name: 'Booking Guest Portal',
    path: '/booking-guest-portal',
    framework: 'React',
    port: 3105,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    description: 'Guest booking and property search',
    longDescription: 'Property rental platform for guests. Search available properties, manage bookings, save favorites to wishlists, and handle reservations.',
    features: [
      { name: 'Search', description: 'Find properties by location, dates, and amenities' },
      { name: 'Booking', description: 'Secure reservation and payment processing' },
      { name: 'Wishlists', description: 'Save and organize favorite properties' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'booking-host-portal',
    name: 'Booking Host Portal',
    path: '/booking-host-portal',
    framework: 'React',
    port: 3106,
    gradient: 'from-teal-500 to-cyan-600',
    bgGradient: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    description: 'Host dashboard for property management',
    longDescription: 'Property management dashboard for hosts. List properties, manage availability calendars, track earnings, and communicate with guests.',
    features: [
      { name: 'Listings', description: 'Create and manage property listings' },
      { name: 'Calendar', description: 'Availability and booking calendar management' },
      { name: 'Earnings', description: 'Revenue tracking and payout management' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'elearning-admin-portal',
    name: 'E-Learning Admin',
    path: '/elearning-admin-portal',
    framework: 'React',
    port: 3107,
    gradient: 'from-fuchsia-500 to-pink-600',
    bgGradient: 'from-fuchsia-50 to-pink-50',
    borderColor: 'border-fuchsia-200',
    textColor: 'text-fuchsia-700',
    description: 'Teacher and admin course management',
    longDescription: 'Learning management system for educators. Create courses, manage content, track student progress, and analyze learning outcomes.',
    features: [
      { name: 'Courses', description: 'Course creation and content management' },
      { name: 'Analytics', description: 'Student engagement and performance metrics' },
      { name: 'Students', description: 'Enrollment and progress management' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'elearning-student-portal',
    name: 'E-Learning Student',
    path: '/elearning-student-portal',
    framework: 'React',
    port: 3108,
    gradient: 'from-lime-500 to-green-600',
    bgGradient: 'from-lime-50 to-green-50',
    borderColor: 'border-lime-200',
    textColor: 'text-lime-700',
    description: 'Student learning platform',
    longDescription: 'Online learning platform for students. Explore available courses, track learning progress, and earn certificates upon completion.',
    features: [
      { name: 'Explore', description: 'Discover and enroll in courses' },
      { name: 'My Courses', description: 'Track progress and continue learning' },
      { name: 'Certificates', description: 'View and download earned certificates' },
    ],
    version: '1.0.0',
    lastUpdated: '2024-01-15',
  },
];

export const getAppById = (id: string): AppInfo | undefined => {
  return apps.find(app => app.id === id);
};

export const getAppByPath = (path: string): AppInfo | undefined => {
  return apps.find(app => app.path === path);
};
