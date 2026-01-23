export interface AppScreenshot {
  url: string;
  alt: string;
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
  description: string; // Short description for cards
  version: string;
  lastUpdated: string;
  screenshots: AppScreenshot[];
  // Single HTML content field - admin can fully customize the detail page
  detailContent: string;
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
    description: 'Hopefull Admin dashboard',
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/hopefull-admin-1.png', alt: 'Dashboard overview' },
      { url: '/screenshots/hopefull-admin-2.png', alt: 'User management' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>A <strong>comprehensive admin dashboard</strong> for managing the Hopefull platform with enterprise-grade features and intuitive user experience.</p>
        <p>Built by <a href="https://saigontechnology.com" target="_blank" rel="noopener noreferrer">Saigon Technology</a>, this solution demonstrates our expertise in building scalable administrative interfaces.</p>
        <blockquote>Designed for efficiency, built for scale.</blockquote>
      </section>

      <section class="technologies">
        <h2>Technologies</h2>
        <div class="tech-tags">
          <span class="tech-tag primary">React 18</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Tailwind CSS</span>
          <span class="tech-tag">React Query</span>
          <span class="tech-tag">Zustand</span>
          <span class="tech-tag">Chart.js</span>
        </div>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>📊 Dashboard</h3>
            <p>Real-time overview of key metrics, KPIs, and system health with customizable widgets.</p>
          </div>
          <div class="feature-card">
            <h3>👥 User Management</h3>
            <p>Complete CRUD operations with <strong>role-based access control</strong> (RBAC) and audit logging.</p>
          </div>
          <div class="feature-card">
            <h3>📈 Analytics</h3>
            <p>Interactive charts, exportable reports, and data visualization powered by Chart.js.</p>
          </div>
          <div class="feature-card">
            <h3>⚙️ Settings</h3>
            <p>System configuration, theme customization, and notification preferences.</p>
          </div>
        </div>
      </section>

      <section class="highlights">
        <h2>Key Highlights</h2>
        <ul>
          <li><strong>Real-time data synchronization</strong> with WebSocket support</li>
          <li><strong>Role-based access control</strong> with granular permissions</li>
          <li><strong>Fully responsive design</strong> optimized for all devices</li>
          <li><strong>Dark/Light mode</strong> with system preference detection</li>
          <li><strong>Internationalization ready</strong> (i18n)</li>
        </ul>
      </section>

      <section class="demo">
        <h2>Demo Credentials</h2>
        <div class="credentials">
          <div class="credential-item">
            <span class="label">Admin User</span>
            <code>admin@demo.com / demo123</code>
          </div>
          <div class="credential-item">
            <span class="label">Viewer User</span>
            <code>viewer@demo.com / demo123</code>
          </div>
        </div>
      </section>
    `,
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
    description: 'Enterprise Asset Management Solution',
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/asset-management-1.png', alt: 'Asset tracking dashboard' },
      { url: '/screenshots/asset-management-2.png', alt: 'Maintenance schedule' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p><strong>Enterprise-grade asset management</strong> solution for tracking, maintaining, and optimizing organizational assets throughout their complete lifecycle.</p>
        <p>Built for <em>manufacturing</em>, <em>healthcare</em>, <em>logistics</em>, and <em>facility management</em> industries.</p>
        <blockquote>Track every asset. Optimize every process. Maximize ROI.</blockquote>
      </section>

      <section class="technologies">
        <h2>Technologies</h2>
        <div class="tech-tags">
          <span class="tech-tag primary">React 18</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Leaflet Maps</span>
          <span class="tech-tag">D3.js</span>
          <span class="tech-tag">PostgreSQL</span>
        </div>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>📍 Asset Tracking</h3>
            <p><strong>Real-time GPS</strong> and RFID location tracking with status monitoring.</p>
          </div>
          <div class="feature-card">
            <h3>🔧 Maintenance</h3>
            <p>Automated <strong>preventive maintenance</strong> scheduling. Reduce downtime by up to <em>40%</em>.</p>
          </div>
          <div class="feature-card">
            <h3>📊 Reports</h3>
            <p>Comprehensive analytics with asset utilization and depreciation reports.</p>
          </div>
          <div class="feature-card">
            <h3>📦 Inventory</h3>
            <p>Manage spare parts with <strong>automatic reorder points</strong>.</p>
          </div>
        </div>
      </section>
    `,
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
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/cmms-1.png', alt: 'Work orders dashboard' },
      { url: '/screenshots/cmms-2.png', alt: 'Preventive maintenance calendar' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>A <strong>full-featured CMMS</strong> (Computerized Maintenance Management System) designed for facilities and equipment maintenance at scale.</p>
        <p>Streamline operations with intelligent work order management, automated PM scheduling, and real-time technician tracking.</p>
      </section>

      <section class="benefits">
        <h2>Key Benefits</h2>
        <ul>
          <li>Reduce equipment downtime by <strong>35%</strong></li>
          <li>Extend asset lifespan through proactive maintenance</li>
          <li>Improve technician productivity with mobile access</li>
        </ul>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>📋 Work Orders</h3>
            <p>Create, assign, and track maintenance tasks with <strong>priority levels</strong> and SLA tracking.</p>
          </div>
          <div class="feature-card">
            <h3>🔄 Preventive Maintenance</h3>
            <p>Schedule recurring maintenance based on time, usage, or condition.</p>
          </div>
          <div class="feature-card">
            <h3>📦 Inventory</h3>
            <p>Parts and supplies management with automatic reorder.</p>
          </div>
          <div class="feature-card">
            <h3>👷 Technicians</h3>
            <p>Workforce scheduling with skill matching and performance KPIs.</p>
          </div>
        </div>
      </section>
    `,
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
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/family-fun-1.png', alt: 'Events listing' },
      { url: '/screenshots/family-fun-2.png', alt: 'Merchant portal' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>Discover and book <strong>family-friendly events</strong> and activities. Features merchant portal for event organizers and admin tools for platform management.</p>
      </section>

      <section class="technologies">
        <h2>Technologies</h2>
        <div class="tech-tags">
          <span class="tech-tag primary">React 18</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Google Maps API</span>
          <span class="tech-tag">Stripe</span>
        </div>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>🎉 Events</h3>
            <p>Browse and book family activities with location-based discovery.</p>
          </div>
          <div class="feature-card">
            <h3>🏪 Merchant Portal</h3>
            <p>Event organizer management dashboard with booking analytics.</p>
          </div>
          <div class="feature-card">
            <h3>⚙️ Admin</h3>
            <p>Platform administration and content moderation tools.</p>
          </div>
        </div>
      </section>
    `,
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
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/booking-guest-1.png', alt: 'Property search' },
      { url: '/screenshots/booking-guest-2.png', alt: 'Booking page' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>Property rental platform for guests. <strong>Search available properties</strong>, manage bookings, save favorites to wishlists, and handle reservations.</p>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>🔍 Search</h3>
            <p>Find properties by location, dates, and amenities with advanced filters.</p>
          </div>
          <div class="feature-card">
            <h3>📅 Booking</h3>
            <p>Secure reservation and payment processing with instant confirmation.</p>
          </div>
          <div class="feature-card">
            <h3>❤️ Wishlists</h3>
            <p>Save and organize favorite properties for future trips.</p>
          </div>
        </div>
      </section>
    `,
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
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/booking-host-1.png', alt: 'Property listings' },
      { url: '/screenshots/booking-host-2.png', alt: 'Availability calendar' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>Property management dashboard for hosts. <strong>List properties</strong>, manage availability calendars, track earnings, and communicate with guests.</p>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>🏠 Listings</h3>
            <p>Create and manage property listings with photos and amenities.</p>
          </div>
          <div class="feature-card">
            <h3>📅 Calendar</h3>
            <p>Availability and booking calendar management with sync support.</p>
          </div>
          <div class="feature-card">
            <h3>💰 Earnings</h3>
            <p>Revenue tracking and payout management dashboard.</p>
          </div>
        </div>
      </section>
    `,
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
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/elearning-admin-1.png', alt: 'Course management' },
      { url: '/screenshots/elearning-admin-2.png', alt: 'Student analytics' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>Learning management system for educators. <strong>Create courses</strong>, manage content, track student progress, and analyze learning outcomes.</p>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>📚 Courses</h3>
            <p>Course creation and content management with rich media support.</p>
          </div>
          <div class="feature-card">
            <h3>📊 Analytics</h3>
            <p>Student engagement and performance metrics dashboard.</p>
          </div>
          <div class="feature-card">
            <h3>👨‍🎓 Students</h3>
            <p>Enrollment and progress management with notifications.</p>
          </div>
        </div>
      </section>
    `,
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
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    screenshots: [
      { url: '/screenshots/elearning-student-1.png', alt: 'Course explorer' },
      { url: '/screenshots/elearning-student-2.png', alt: 'Learning progress' },
    ],
    detailContent: `
      <section class="about">
        <h2>About</h2>
        <p>Online learning platform for students. <strong>Explore available courses</strong>, track learning progress, and earn certificates upon completion.</p>
      </section>

      <section class="features">
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>🔍 Explore</h3>
            <p>Discover and enroll in courses with personalized recommendations.</p>
          </div>
          <div class="feature-card">
            <h3>📖 My Courses</h3>
            <p>Track progress and continue learning with bookmarks.</p>
          </div>
          <div class="feature-card">
            <h3>🏆 Certificates</h3>
            <p>View and download earned certificates with verification.</p>
          </div>
        </div>
      </section>
    `,
  },
];

export const getAppById = (id: string): AppInfo | undefined => {
  return apps.find(app => app.id === id);
};

export const getAppByPath = (path: string): AppInfo | undefined => {
  return apps.find(app => app.path === path);
};
