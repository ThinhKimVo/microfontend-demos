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
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <h3>Real-time Dashboard</h3>
              <p>Live metrics, KPIs, and system health with customizable widgets and instant updates.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>User Management</h3>
              <p>Complete CRUD with role-based access control (RBAC) and detailed audit logging.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
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
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Real-time Tracking</h3>
              <p>GPS and RFID location tracking with live status monitoring and geofencing alerts.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3>Preventive Maintenance</h3>
              <p>Automated scheduling based on time, usage, or condition to prevent failures.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              </div>
              <h3>Analytics & Reports</h3>
              <p>Utilization metrics, depreciation tracking, and customizable dashboards.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
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
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="m9 14 2 2 4-4"/>
                </svg>
              </div>
              <h3>Work Orders</h3>
              <p>Create, assign, and track tasks with priority levels, SLA tracking, and mobile notifications.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
                </svg>
              </div>
              <h3>Preventive Maintenance</h3>
              <p>Automated scheduling based on time intervals, meter readings, or condition triggers.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>Parts Inventory</h3>
              <p>Track spare parts with min/max levels, automatic reordering, and vendor management.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
                </svg>
              </div>
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
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>
                </svg>
              </div>
              <h3>Curated Events</h3>
              <p>Hand-picked family-friendly activities verified for quality and safety.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Location-Based</h3>
              <p>Discover events near you with interactive maps and distance filters.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3>Easy Booking</h3>
              <p>Secure payments with instant confirmation and mobile tickets.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
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
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3>Smart Search</h3>
              <p>Find properties by location, dates, guests, and amenities with powerful filters.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3>Instant Booking</h3>
              <p>Secure reservations with real-time availability and instant confirmation.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <h3>Wishlists</h3>
              <p>Save your favorite properties and share lists with travel companions.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
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
              <div class="icon cyan">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3>Property Listings</h3>
              <p>Create beautiful listings with unlimited photos, amenities, and house rules.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3>Smart Calendar</h3>
              <p>Manage availability with sync to Airbnb, VRBO, and Google Calendar.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3>Earnings Dashboard</h3>
              <p>Track revenue, view payout history, and download tax documents.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
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
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
              </div>
              <h3>Course Management</h3>
              <p>Create and organize courses with rich media content, modules, and learning paths.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <h3>Assignments & Quizzes</h3>
              <p>Create assessments with auto-grading, time limits, and detailed feedback options.</p>
            </div>
            <div class="feature-card">
              <div class="icon cyan">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3>Progress Analytics</h3>
              <p>Track student engagement, completion rates, and performance metrics in real-time.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Discussion Forums</h3>
              <p>Foster collaboration with threaded discussions, Q&A boards, and peer reviews.</p>
            </div>
            <div class="feature-card">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <h3>Live Classes</h3>
              <p>Host virtual classrooms with video conferencing, screen sharing, and recording.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
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
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3>Explore Courses</h3>
              <p>Browse thousands of courses with personalized recommendations based on your interests.</p>
            </div>
            <div class="feature-card">
              <div class="icon blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3>Interactive Learning</h3>
              <p>Video lessons, quizzes, assignments, and hands-on projects for effective learning.</p>
            </div>
            <div class="feature-card">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3>Track Progress</h3>
              <p>Visual progress tracking, study streaks, and achievement badges to keep you motivated.</p>
            </div>
            <div class="feature-card">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
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
