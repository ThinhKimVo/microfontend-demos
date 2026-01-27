import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ReactIcon, ArrowIcon, ClearIcon, SettingsIcon } from '../components/Icons';
import { LoadingScreen } from '../components/LoadingScreen';
import { useLoadApps } from '../hooks';

export default function Home() {
  const [search, setSearch] = useState('');
  const { apps, loading } = useLoadApps();

  // rerender-memo: Memoize filtered results to avoid recalculation on every render
  const filteredApps = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return apps;
    return apps.filter((app) =>
      app.name.toLowerCase().includes(query) ||
      app.framework.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query)
    );
  }, [apps, search]);

  if (loading) {
    return <LoadingScreen message="Loading apps…" />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            Saigon Technology Demos
          </h1>
          <Link
            to="/admin"
            className="text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 rounded-lg p-1"
            aria-label="Admin Panel"
          >
            <SettingsIcon aria-hidden="true" className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          Demo applications showcasing scalable, maintainable enterprise solutions.
        </p>

        {/* Search Bar */}
        <div className="mt-5 max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SearchIcon aria-hidden="true" className="w-4 h-4" />
            </div>
            <input
              type="search"
              name="app-search"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:border-transparent"
              aria-label="Search apps"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 rounded-lg"
                aria-label="Clear search"
              >
                <ClearIcon aria-hidden="true" className="w-4 h-4" />
              </button>
            )}
          </div>
          {search && (
            <p className="mt-2 text-xs text-slate-500" aria-live="polite">
              {filteredApps.length} {filteredApps.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon aria-hidden="true" />
          </div>
          <h2 className="text-lg font-medium text-slate-900 mb-1">No apps found</h2>
          <p className="text-slate-500">Try adjusting your search terms</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <article
            key={app.id}
            className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
          >
            {/* Card Header */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <ReactIcon aria-hidden="true" className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {app.framework}
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-1">{app.name}</h2>
              <p className="text-slate-500 text-sm line-clamp-2">{app.description}</p>
            </div>

            {/* Card Footer */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">v{app.version}</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400">:{app.port}</span>
              </div>
              <Link
                to={`/app/${app.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
              >
                View
                <ArrowIcon aria-hidden="true" className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      )}

      {/* Info Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Why Choose Saigon Technology?</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="flex gap-3">
            <div className="w-7 h-7 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-semibold flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-slate-900">Proven Expertise</p>
              <p className="text-slate-500">15+ years delivering enterprise solutions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-7 h-7 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-semibold flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-slate-900">Modern Architecture</p>
              <p className="text-slate-500">Scalable microfrontend design</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-7 h-7 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-semibold flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-slate-900">Dedicated Teams</p>
              <p className="text-slate-500">Flexible engagement models</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative px-6 py-12 sm:px-12 sm:py-16">
          {/* Stats Row */}
          <div className="flex justify-center gap-8 sm:gap-16 mb-8">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">15+</p>
              <p className="text-xs text-slate-400 mt-1">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
              <p className="text-xs text-slate-400 mt-1">Projects Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">98%</p>
              <p className="text-xs text-slate-400 mt-1">Client Satisfaction</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-8" />

          {/* Content */}
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              Ready to Build Your Next Project?
            </h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Partner with Saigon Technology to transform your ideas into powerful, scalable applications.
            </p>
            <a
              href="https://saigontechnology.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Contact Us Today
              <ArrowIcon aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
