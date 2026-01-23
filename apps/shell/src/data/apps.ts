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
      { url: '/screenshots/hopefull-admin-1.png', alt: 'Login' },
      { url: '/screenshots/hopefull-admin-2.png', alt: 'Dashboard overview' },
      { url: '/screenshots/hopefull-admin-3.png', alt: 'User management' },
    ],
    detailContent: `
      <!-- Hero Section -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>All-In-One <span class="accent">Admin Solution</span></h2>
          <p class="subtitle">A comprehensive admin dashboard for managing the Hopefull platform with enterprise-grade features and intuitive user experience.</p>
          <div class="tech-tags" style="justify-content: center;">
            <span class="tech-tag primary">React 18</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Tailwind CSS</span>
            <span class="tech-tag">React Query</span>
          </div>
        </div>
      </section>

      <!-- Features Grid -->
      <section class="bg-light">
        <div class="container">
          <h2>Powerful <span class="accent">Features</span></h2>
          <p class="subtitle">Everything you need to manage your platform efficiently</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon blue">📊</div>
              <h3>Real-time Dashboard</h3>
              <p>Live metrics, KPIs, and system health with customizable widgets and instant updates.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">👥</div>
              <h3>User Management</h3>
              <p>Complete CRUD with role-based access control (RBAC) and detailed audit logging.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">📈</div>
              <h3>Advanced Analytics</h3>
              <p>Interactive charts, exportable reports, and powerful data visualization tools.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-white">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="number">99.9%</div>
              <div class="label">Uptime SLA</div>
            </div>
            <div class="stat-item">
              <div class="number">50K+</div>
              <div class="label">Active Users</div>
            </div>
            <div class="stat-item">
              <div class="number">35%</div>
              <div class="label">Faster Operations</div>
            </div>
            <div class="stat-item">
              <div class="number">24/7</div>
              <div class="label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Cards -->
      <section class="bg-light">
        <div class="container">
          <h2>Get <span class="accent">Started</span></h2>
          <p class="subtitle">Choose your role and explore the platform</p>
          <div class="cta-grid">
            <div class="cta-card">
              <img src="/screenshots/hopefull-admin-1.png" alt="Admin Dashboard">
              <div class="overlay">
                <h3>For Administrators</h3>
                <a href="#" class="btn light">Access Dashboard</a>
              </div>
            </div>
            <div class="cta-card">
              <img src="/screenshots/hopefull-admin-2.png" alt="User Management">
              <div class="overlay">
                <h3>For Team Leads</h3>
                <a href="#" class="btn orange">Manage Team</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Split Section -->
      <section class="bg-white">
        <div class="container split-section">
          <div class="content">
            <h2>Everything you need, <span class="accent">all in one place</span></h2>
            <p>Our admin dashboard provides a centralized hub for all your management needs. From user administration to analytics, everything is accessible from a single, intuitive interface.</p>
            <ul>
              <li><strong>Real-time synchronization</strong> with WebSocket</li>
              <li><strong>Role-based permissions</strong> for security</li>
              <li><strong>Dark/Light mode</strong> support</li>
              <li><strong>Mobile responsive</strong> design</li>
            </ul>
            <a href="https://saigontechnology.com/contact/" target="_blank" class="btn-primary">Contact Us</a>
          </div>
          <div class="media">
            <img src="/screenshots/hopefull-admin-3.png" alt="Dashboard Preview">
          </div>
        </div>
      </section>

      <!-- Testimonial -->
      <section class="bg-light">
        <div class="container">
          <blockquote>
            <p>"The Hopefull Admin dashboard has transformed how we manage our platform. The intuitive interface and powerful features have increased our team's productivity by 40%."</p>
            <cite>— Product Manager, Enterprise Client</cite>
          </blockquote>
        </div>
      </section>

      <!-- Demo Credentials -->
      <section class="bg-white">
        <div class="container">
          <h2>Try the <span class="accent">Demo</span></h2>
          <p class="subtitle">Use these credentials to explore the full functionality</p>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>Enterprise <span class="accent">Asset Management</span></h2>
          <p class="subtitle">Track, maintain, and optimize organizational assets throughout their complete lifecycle. Built for manufacturing, healthcare, logistics, and facility management.</p>
        </div>
      </section>

      <!-- Stats -->
      <section class="bg-white">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="number">40%</div>
              <div class="label">Reduced Downtime</div>
            </div>
            <div class="stat-item">
              <div class="number">99%</div>
              <div class="label">Asset Visibility</div>
            </div>
            <div class="stat-item">
              <div class="number">3x</div>
              <div class="label">Faster Audits</div>
            </div>
            <div class="stat-item">
              <div class="number">25%</div>
              <div class="label">Cost Savings</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-light">
        <div class="container">
          <h2>Powerful <span class="accent">Features</span></h2>
          <p class="subtitle">Everything you need to manage assets efficiently</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon blue">📍</div>
              <h3>Real-time Tracking</h3>
              <p>GPS and RFID location tracking with live status monitoring and geofencing alerts.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">🔧</div>
              <h3>Preventive Maintenance</h3>
              <p>Automated scheduling based on time, usage, or condition to prevent failures.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">📊</div>
              <h3>Analytics & Reports</h3>
              <p>Utilization metrics, depreciation tracking, and customizable dashboards.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">📦</div>
              <h3>Inventory Management</h3>
              <p>Spare parts tracking with automatic reorder points and vendor management.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Split Section -->
      <section class="bg-white">
        <div class="container split-section">
          <div class="content">
            <h2>Track every asset, <span class="accent">optimize every process</span></h2>
            <p>Our asset management solution provides complete visibility into your organization's equipment, vehicles, and infrastructure.</p>
            <ul>
              <li><strong>Barcode & QR scanning</strong> for quick lookups</li>
              <li><strong>Custom fields</strong> for any asset type</li>
              <li><strong>Document attachments</strong> and history</li>
              <li><strong>Mobile app</strong> for field teams</li>
            </ul>
            <a href="#" class="btn-primary">Request Demo</a>
          </div>
          <div class="media">
            <img src="/screenshots/asset-management-1.png" alt="Asset Dashboard">
          </div>
        </div>
      </section>

      <!-- Technologies -->
      <section class="bg-light">
        <div class="container">
          <h2>Built with Modern <span class="accent">Technologies</span></h2>
          <div class="tech-tags" style="justify-content: center; margin-top: 2rem;">
            <span class="tech-tag primary">React 18</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Leaflet Maps</span>
            <span class="tech-tag">D3.js</span>
            <span class="tech-tag">PostgreSQL</span>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>Computerized Maintenance <span class="accent">Management System</span></h2>
          <p class="subtitle">Streamline facilities and equipment maintenance with intelligent work order management, automated PM scheduling, and real-time technician tracking.</p>
        </div>
      </section>

      <!-- Stats -->
      <section class="bg-white">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="number">35%</div>
              <div class="label">Less Downtime</div>
            </div>
            <div class="stat-item">
              <div class="number">50%</div>
              <div class="label">Faster Response</div>
            </div>
            <div class="stat-item">
              <div class="number">2x</div>
              <div class="label">Asset Lifespan</div>
            </div>
            <div class="stat-item">
              <div class="number">100%</div>
              <div class="label">Compliance</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-light">
        <div class="container">
          <h2>Core <span class="accent">Features</span></h2>
          <p class="subtitle">Complete maintenance management toolkit</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon blue">📋</div>
              <h3>Work Orders</h3>
              <p>Create, assign, and track tasks with priority levels, SLA tracking, and mobile notifications.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">🔄</div>
              <h3>Preventive Maintenance</h3>
              <p>Automated scheduling based on time intervals, meter readings, or condition triggers.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">📦</div>
              <h3>Parts Inventory</h3>
              <p>Track spare parts with min/max levels, automatic reordering, and vendor management.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">👷</div>
              <h3>Technician Management</h3>
              <p>Skill-based assignments, workload balancing, and performance dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Cards -->
      <section class="bg-white">
        <div class="container">
          <h2>Get <span class="accent">Started</span></h2>
          <div class="cta-grid">
            <div class="cta-card">
              <img src="/screenshots/cmms-1.png" alt="Work Orders">
              <div class="overlay">
                <h3>Maintenance Team</h3>
                <a href="#" class="btn light">View Work Orders</a>
              </div>
            </div>
            <div class="cta-card">
              <img src="/screenshots/cmms-2.png" alt="PM Calendar">
              <div class="overlay">
                <h3>Facility Managers</h3>
                <a href="#" class="btn orange">Access Dashboard</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonial -->
      <section class="bg-light">
        <div class="container">
          <blockquote>
            <p>"Since implementing CMMS, we've reduced unplanned downtime by 40% and extended our equipment lifespan significantly."</p>
            <cite>— Facilities Director, Manufacturing Company</cite>
          </blockquote>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>Discover <span class="accent">Family Fun</span></h2>
          <p class="subtitle">Find and book amazing family-friendly events and activities in your area. Create unforgettable memories with your loved ones.</p>
        </div>
      </section>

      <!-- CTA Cards -->
      <section class="bg-white">
        <div class="container">
          <div class="cta-grid">
            <div class="cta-card">
              <img src="/screenshots/family-fun-1.png" alt="Browse Events">
              <div class="overlay">
                <h3>For Families</h3>
                <a href="#" class="btn light">Explore Events</a>
              </div>
            </div>
            <div class="cta-card">
              <img src="/screenshots/family-fun-2.png" alt="Merchant Portal">
              <div class="overlay">
                <h3>For Event Organizers</h3>
                <a href="#" class="btn orange">List Your Event</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-light">
        <div class="container">
          <h2>Why Choose <span class="accent">FamilyFun?</span></h2>
          <p class="subtitle">The easiest way to plan family activities</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon purple">🎉</div>
              <h3>Curated Events</h3>
              <p>Hand-picked family-friendly activities verified for quality and safety.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">📍</div>
              <h3>Location-Based</h3>
              <p>Discover events near you with interactive maps and distance filters.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">💳</div>
              <h3>Easy Booking</h3>
              <p>Secure payments with instant confirmation and mobile tickets.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">⭐</div>
              <h3>Reviews & Ratings</h3>
              <p>Real feedback from families to help you choose the best activities.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Split Section -->
      <section class="bg-white">
        <div class="container split-section">
          <div class="content">
            <h2>For Event <span class="accent">Organizers</span></h2>
            <p>Reach thousands of families looking for activities. Our merchant portal makes it easy to list events, manage bookings, and grow your business.</p>
            <ul>
              <li><strong>Easy event creation</strong> with rich media</li>
              <li><strong>Real-time booking</strong> management</li>
              <li><strong>Analytics dashboard</strong> for insights</li>
              <li><strong>Secure payouts</strong> via Stripe</li>
            </ul>
            <a href="#" class="btn-primary">Become a Partner</a>
          </div>
          <div class="media">
            <img src="/screenshots/family-fun-2.png" alt="Merchant Dashboard">
          </div>
        </div>
      </section>

      <!-- Technologies -->
      <section class="bg-light">
        <div class="container">
          <h2>Powered by <span class="accent">Modern Tech</span></h2>
          <div class="tech-tags" style="justify-content: center; margin-top: 2rem;">
            <span class="tech-tag primary">React 18</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Google Maps API</span>
            <span class="tech-tag">Stripe</span>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient-orange">
        <div class="container">
          <h2>Find Your Perfect <span class="accent">Stay</span></h2>
          <p class="subtitle">Discover unique properties and book your next adventure. From cozy apartments to luxury villas, find accommodations that feel like home.</p>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-white">
        <div class="container">
          <h2>Book with <span class="accent">Confidence</span></h2>
          <p class="subtitle">Everything you need for a seamless booking experience</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon orange">🔍</div>
              <h3>Smart Search</h3>
              <p>Find properties by location, dates, guests, and amenities with powerful filters.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">📅</div>
              <h3>Instant Booking</h3>
              <p>Secure reservations with real-time availability and instant confirmation.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">❤️</div>
              <h3>Wishlists</h3>
              <p>Save your favorite properties and share lists with travel companions.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">💬</div>
              <h3>Host Messaging</h3>
              <p>Direct communication with hosts for questions and special requests.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Cards -->
      <section class="bg-light">
        <div class="container">
          <h2>Start Your <span class="accent">Journey</span></h2>
          <div class="cta-grid">
            <div class="cta-card">
              <img src="/screenshots/booking-guest-1.png" alt="Search Properties">
              <div class="overlay">
                <h3>Browse Properties</h3>
                <a href="#" class="btn light">Start Searching</a>
              </div>
            </div>
            <div class="cta-card">
              <img src="/screenshots/booking-guest-2.png" alt="My Bookings">
              <div class="overlay">
                <h3>My Reservations</h3>
                <a href="#" class="btn orange">View Bookings</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="bg-gradient-orange">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">10K+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Properties</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">50K+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Happy Guests</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">100+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Destinations</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">4.8★</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Avg Rating</div>
            </div>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>Manage Your <span class="accent">Properties</span></h2>
          <p class="subtitle">The complete host dashboard for listing properties, managing bookings, and maximizing your rental income.</p>
        </div>
      </section>

      <!-- Stats -->
      <section class="bg-white">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="number">30%</div>
              <div class="label">More Bookings</div>
            </div>
            <div class="stat-item">
              <div class="number">24h</div>
              <div class="label">Fast Payouts</div>
            </div>
            <div class="stat-item">
              <div class="number">0%</div>
              <div class="label">Hidden Fees</div>
            </div>
            <div class="stat-item">
              <div class="number">24/7</div>
              <div class="label">Host Support</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-light">
        <div class="container">
          <h2>Host <span class="accent">Tools</span></h2>
          <p class="subtitle">Everything you need to succeed as a host</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon cyan">🏠</div>
              <h3>Property Listings</h3>
              <p>Create beautiful listings with unlimited photos, amenities, and house rules.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">📅</div>
              <h3>Smart Calendar</h3>
              <p>Manage availability with sync to Airbnb, VRBO, and Google Calendar.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">💰</div>
              <h3>Earnings Dashboard</h3>
              <p>Track revenue, view payout history, and download tax documents.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">💬</div>
              <h3>Guest Communication</h3>
              <p>Messaging with saved responses, automated check-in instructions.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Split Section -->
      <section class="bg-white">
        <div class="container split-section">
          <div class="content">
            <h2>Grow your rental <span class="accent">business</span></h2>
            <p>Our host portal provides all the tools you need to manage properties efficiently and maximize your earnings.</p>
            <ul>
              <li><strong>Dynamic pricing</strong> suggestions</li>
              <li><strong>Performance analytics</strong> and insights</li>
              <li><strong>Multi-property</strong> management</li>
              <li><strong>Review management</strong> tools</li>
            </ul>
            <a href="#" class="btn-primary">Start Hosting</a>
          </div>
          <div class="media">
            <img src="/screenshots/booking-host-1.png" alt="Host Dashboard">
          </div>
        </div>
      </section>

      <!-- Testimonial -->
      <section class="bg-light">
        <div class="container">
          <blockquote>
            <p>"The host portal made managing my 5 properties a breeze. The calendar sync alone saves me hours every week!"</p>
            <cite>— Property Owner, 5-Star Superhost</cite>
          </blockquote>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>What is <span class="accent">E-Learning Admin?</span></h2>
          <p class="subtitle">A platform that allows educators to create online classes, store course materials, manage assignments, quizzes and exams, monitor due dates, grade results and provide students with feedback all in one place.</p>
        </div>
      </section>

      <!-- CTA Cards - For Instructors / Students -->
      <section class="bg-white">
        <div class="container">
          <div class="cta-grid">
            <div class="cta-card">
              <img src="/screenshots/elearning-admin-1.png" alt="For Instructors">
              <div class="overlay">
                <h3>For Instructors</h3>
                <a href="#" class="btn light">Start a class today</a>
              </div>
            </div>
            <div class="cta-card">
              <img src="/screenshots/elearning-admin-2.png" alt="For Students">
              <div class="overlay">
                <h3>For Students</h3>
                <a href="#" class="btn orange">Enter access code</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Split Section -->
      <section class="bg-light">
        <div class="container split-section">
          <div class="content">
            <h2>Everything you can do in a physical classroom, <span class="accent">you can do with E-Learning</span></h2>
            <p>Our school management software helps traditional and online schools manage scheduling, attendance, payments and virtual classrooms all in one secure cloud-based system.</p>
            <a href="#" class="btn-primary">Learn more</a>
          </div>
          <div class="media">
            <img src="/screenshots/elearning-admin-1.png" alt="E-Learning Platform">
            <div class="play-btn"></div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-white">
        <div class="container">
          <h2>Our <span class="accent">Features</span></h2>
          <p class="subtitle">This very extraordinary feature can make learning activities more efficient</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon blue">📚</div>
              <h3>Course Management</h3>
              <p>Create and organize courses with rich media content, modules, and learning paths.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">📝</div>
              <h3>Assignments & Quizzes</h3>
              <p>Create assessments with auto-grading, time limits, and detailed feedback options.</p>
            </div>
            <div class="feature-card">
              <div class="icon cyan">📊</div>
              <h3>Progress Analytics</h3>
              <p>Track student engagement, completion rates, and performance metrics in real-time.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">💬</div>
              <h3>Discussion Forums</h3>
              <p>Foster collaboration with threaded discussions, Q&A boards, and peer reviews.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">🎥</div>
              <h3>Live Classes</h3>
              <p>Host virtual classrooms with video conferencing, screen sharing, and recording.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">🏆</div>
              <h3>Certificates</h3>
              <p>Issue customizable certificates upon course completion with verification.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="bg-gradient-orange">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">10K+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Active Courses</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">50K+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Students Enrolled</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">95%</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Satisfaction Rate</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">24/7</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Platform Access</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Technologies -->
      <section class="bg-light">
        <div class="container">
          <h2>Built with Modern <span class="accent">Technologies</span></h2>
          <div class="tech-tags" style="justify-content: center; margin-top: 2rem;">
            <span class="tech-tag primary">React 18</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Node.js</span>
            <span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">WebRTC</span>
            <span class="tech-tag">AWS S3</span>
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
      <!-- Hero -->
      <section class="hero-section bg-gradient">
        <div class="container">
          <h2>Learn Anything, <span class="accent">Anywhere</span></h2>
          <p class="subtitle">Access world-class courses, track your progress, and earn certificates. Your journey to knowledge starts here.</p>
        </div>
      </section>

      <!-- Features -->
      <section class="bg-white">
        <div class="container">
          <h2>Your Learning <span class="accent">Journey</span></h2>
          <p class="subtitle">Everything you need to succeed</p>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon green">🔍</div>
              <h3>Explore Courses</h3>
              <p>Browse thousands of courses with personalized recommendations based on your interests.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">📖</div>
              <h3>Interactive Learning</h3>
              <p>Video lessons, quizzes, assignments, and hands-on projects for effective learning.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">📊</div>
              <h3>Track Progress</h3>
              <p>Visual progress tracking, study streaks, and achievement badges to keep you motivated.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">🏆</div>
              <h3>Earn Certificates</h3>
              <p>Get verified certificates upon completion to showcase your new skills.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Cards -->
      <section class="bg-light">
        <div class="container">
          <h2>Start <span class="accent">Learning</span></h2>
          <div class="cta-grid">
            <div class="cta-card">
              <img src="/screenshots/elearning-student-1.png" alt="Course Explorer">
              <div class="overlay">
                <h3>Browse Courses</h3>
                <a href="#" class="btn light">Explore Now</a>
              </div>
            </div>
            <div class="cta-card">
              <img src="/screenshots/elearning-student-2.png" alt="My Learning">
              <div class="overlay">
                <h3>Continue Learning</h3>
                <a href="#" class="btn orange">My Courses</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="bg-gradient">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">500+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Courses</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">50K+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Students</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">100+</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Instructors</div>
            </div>
            <div class="stat-item" style="color: white;">
              <div class="number" style="color: white;">4.9★</div>
              <div class="label" style="color: rgba(255,255,255,0.8);">Rating</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonial -->
      <section class="bg-white">
        <div class="container">
          <blockquote>
            <p>"This platform helped me transition into a new career. The courses are well-structured and the certificates are recognized by employers."</p>
            <cite>— Software Developer, Career Changer</cite>
          </blockquote>
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
