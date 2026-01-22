import { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ReactIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96.77-.16 1.58-.28 2.4-.36.48-.67.99-1.31 1.51-1.9z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const SHELL_PORT = 3100;

const demos = [
  {
    name: 'Hopefull Admin',
    path: '/hopefull-admin',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'Hopefull Admin dashboard microfrontend',
    features: ['Dashboard', 'Users', 'Analytics'],
  },
  {
    name: 'AssestManagement Remote',
    path: '/assest-management',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'AssestManagement microfrontend',
    features: ['App'],
  },
  {
    name: 'Cmms Remote',
    path: '/cmms',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: 'Cmms microfrontend',
    features: ['App'],
  },
  {
    name: 'FamilyFun',
    path: '/family-fun',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    description: 'Family events and activities platform',
    features: ['Events', 'Merchant Portal', 'Admin'],
  },
  {
    name: 'Booking Guest Portal',
    path: '/booking-guest-portal',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    description: 'Guest booking and property search',
    features: ['Search', 'Booking', 'Wishlists'],
  },
  {
    name: 'Booking Host Portal',
    path: '/booking-host-portal',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-teal-500 to-cyan-600',
    bgGradient: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    description: 'Host dashboard for property management',
    features: ['Listings', 'Calendar', 'Earnings'],
  },
  {
    name: 'E-Learning Admin',
    path: '/elearning-admin-portal',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-fuchsia-500 to-pink-600',
    bgGradient: 'from-fuchsia-50 to-pink-50',
    borderColor: 'border-fuchsia-200',
    textColor: 'text-fuchsia-700',
    description: 'Teacher and admin course management',
    features: ['Courses', 'Analytics', 'Students'],
  },
  {
    name: 'E-Learning Student',
    path: '/elearning-student-portal',
    framework: 'React',
    icon: ReactIcon,
    gradient: 'from-lime-500 to-green-600',
    bgGradient: 'from-lime-50 to-green-50',
    borderColor: 'border-lime-200',
    textColor: 'text-lime-700',
    description: 'Student learning platform',
    features: ['Explore', 'My Courses', 'Certificates'],
  },
];

export default function Home() {
  const [search, setSearch] = useState('');

  const filteredDemos = demos.filter((demo) => {
    const query = search.toLowerCase();
    return (
      demo.name.toLowerCase().includes(query) ||
      demo.framework.toLowerCase().includes(query) ||
      demo.description.toLowerCase().includes(query) ||
      demo.features.some((f) => f.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">
          Microfrontend Demo Platform
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore Webpack 5 Module Federation with cross-framework microfrontends.
          Each remote application runs independently and integrates seamlessly at runtime.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search demos by name, framework, or feature..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              aria-label="Search demos"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {search && (
            <p className="mt-2 text-sm text-slate-500">
              {filteredDemos.length} {filteredDemos.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredDemos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No demos found</h3>
          <p className="text-slate-500">Try adjusting your search terms</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDemos.map((demo) => (
          <article
            key={demo.path}
            className={`group relative bg-gradient-to-br ${demo.bgGradient} rounded-2xl border ${demo.borderColor} overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1`}
          >
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${demo.gradient} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <demo.icon />
                </div>
                <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  :{SHELL_PORT}
                </span>
              </div>
              <h2 className="text-xl font-bold mt-4 text-balance">{demo.name}</h2>
              <p className="text-sm text-white/80 mt-1">{demo.framework} Application</p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {demo.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {demo.features.map((feature) => (
                  <span
                    key={feature}
                    className={`text-xs font-medium ${demo.textColor} bg-white px-2.5 py-1 rounded-full border ${demo.borderColor}`}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to={demo.path}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${demo.gradient} text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500`}
                >
                  Open App
                  <ArrowIcon />
                </Link>
                <a
                  href={`http://localhost:${SHELL_PORT}${demo.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 border ${demo.borderColor} rounded-xl ${demo.textColor} hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500`}
                  aria-label={`Open ${demo.name} in new tab`}
                >
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      )}

      {/* Info Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">How it works</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-slate-900">Shell Host</p>
              <p className="text-slate-500">Loads remotes dynamically at runtime</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-slate-900">Module Federation</p>
              <p className="text-slate-500">Webpack 5 shares dependencies</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-slate-900">Independent Apps</p>
              <p className="text-slate-500">Each app deploys independently</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
