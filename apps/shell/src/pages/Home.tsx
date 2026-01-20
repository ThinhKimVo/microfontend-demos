import React from 'react';

const demos = [
  {
    name: 'React Remote',
    port: 3101,
    framework: 'React',
    color: 'bg-sky-500',
    hoverColor: 'hover:bg-sky-600',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
    bgLight: 'bg-sky-50',
    description: 'E-commerce components with Product List and Cart Widget',
    features: ['Product Catalog', 'Shopping Cart', 'Add to Cart'],
  },
  {
    name: 'Vue Remote',
    port: 3102,
    framework: 'Vue',
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    description: 'Analytics dashboard with interactive charts and stats',
    features: ['Dashboard', 'Charts', 'Statistics'],
  },
  {
    name: 'Angular Remote',
    port: 3103,
    framework: 'Angular',
    color: 'bg-rose-500',
    hoverColor: 'hover:bg-rose-600',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    bgLight: 'bg-rose-50',
    description: 'Settings and user profile management modules',
    features: ['Settings', 'Profile', 'Preferences'],
  },
  {
    name: 'Hopefull Admin',
    port: 3104,
    framework: 'React',
    color: 'bg-violet-500',
    hoverColor: 'hover:bg-violet-600',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    bgLight: 'bg-violet-50',
    description: 'Admin dashboard with user management capabilities',
    features: ['Dashboard', 'Users', 'Admin Tools'],
  },
];

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);


export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="w-2 h-2 bg-green-400 rounded-full motion-safe:animate-pulse" aria-hidden="true"></span>
          <span>All services running</span>
        </div>
        <h1 className="text-3xl font-bold mb-3 text-balance">
          Microfrontend Demo Platform
        </h1>
        <p className="text-slate-300 max-w-2xl leading-relaxed">
          Explore Webpack 5 Module Federation with cross-framework microfrontends.
          Each remote application runs independently and integrates seamlessly at runtime.
        </p>
      </div>

      {/* Demo Apps Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Demo Applications</h2>
          <span className="text-sm text-gray-500">{demos.length} apps available</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full" aria-label="Demo applications">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Framework
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Port
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demos.map((demo) => (
                <tr
                  key={demo.port}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${demo.color} rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-sm">
                          {demo.framework[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{demo.name}</p>
                        <p className="text-sm text-gray-500">{demo.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${demo.bgLight} ${demo.textColor}`}
                    >
                      {demo.framework}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      :{demo.port}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {demo.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <a
                        href={`http://localhost:${demo.port}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white ${demo.color} ${demo.hoverColor} rounded-lg transition-colors`}
                      >
                        Open
                        <ExternalLinkIcon />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
