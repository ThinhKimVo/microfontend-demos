import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ReactIcon, ArrowIcon, ClearIcon, SettingsIcon } from '../components/Icons';
import { LoadingScreen } from '../components/LoadingScreen';
import { useLoadApps } from '../hooks';

export default function Home() {
  const [search, setSearch] = useState('');
  const { apps, loading } = useLoadApps();

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
    return <LoadingScreen message="Initialising Core Modules…" />;
  }

  return (
    <div className="space-y-24">
      {/* Hero Section: High Impact Typography */}
      <section className="relative py-12 text-center stagger-load">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
          <span className="font-mono text-[10px] tracking-[0.2em] text-accent-cyan uppercase">
            Demo applications showcasing microfrontend
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] text-white">
          SAIGON <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-emerald">
            TECHNOLOGY.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-12">
          Enterprise-grade microfrontends orchestrated for <br className="hidden md:block" />
          maximum performance and modular scalability.
        </p>

        {/* Search Bar - Minimalist & Focused */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 to-accent-emerald/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-cyan transition-colors" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Query application registry..."
              className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan/50 transition-all font-mono text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-accent-cyan transition-colors"
              >
                <ClearIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Cards Grid - Staggered Reveal */}
      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-bold">Remote Modules</h2>
            <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-widest">
              Available services: {filteredApps.length}
            </p>
          </div>
          <Link to="/admin" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-cyan transition-colors">
            <SettingsIcon className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        {filteredApps.length === 0 ? (
          <div className="py-32 text-center glass-panel rounded-3xl border-dashed border-white/10">
            <p className="font-mono text-sm text-slate-500 uppercase tracking-[0.3em]">No modules found matching query</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <article
                key={app.id}
                className="kinetic-card rounded-2xl overflow-hidden flex flex-col group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8 flex-1">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan group-hover:text-obsidian transition-all duration-500">
                      <ReactIcon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
                      {app.framework}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent-cyan transition-colors">{app.name}</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-3">{app.description}</p>
                </div>

                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                  <div className="font-mono text-[10px] text-slate-500 flex gap-4">
                    <span>v{app.version}</span>
                    <span className="text-white/10">/</span>
                    <span>PORT:{app.port}</span>
                  </div>
                  <Link
                    to={`/app/${app.id}`}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-accent-cyan transition-colors"
                  >
                    View
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Info Section - Monolithic Blocks */}
      <section className="grid lg:grid-cols-3 gap-6">
        {[
          { id: '01', title: 'Proven Expertise', desc: '15+ years of architectural excellence in global markets.' },
          { id: '02', title: 'Modular Core', desc: 'Independent scaling through distributed microfrontend patterns.' },
          { id: '03', title: 'Rapid Synthesis', desc: 'Integrated delivery pipelines for accelerated market entry.' }
        ].map((item) => (
          <div key={item.id} className="glass-panel p-10 rounded-3xl group border-l-4 border-l-transparent hover:border-l-accent-cyan transition-all duration-500">
            <span className="font-mono text-4xl font-black text-white/5 mb-6 block group-hover:text-accent-cyan/20 transition-colors">
              {item.id}
            </span>
            <h3 className="text-lg font-bold mb-3">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Section - Kinetic Monolith */}
      <section className="relative rounded-[3rem] overflow-hidden bg-surface border border-white/10 py-24 px-12 text-center group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-magenta/10 opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-white">
            READY TO <br />
            TRANSCEND?
          </h2>
          <p className="text-slate-400 text-lg mb-12 font-light">
            Partner with Saigon Technology to engineer the next generation of digital infrastructure.
          </p>
          <a
            href="https://saigontechnology.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-10 py-5 bg-white text-obsidian font-black rounded-full hover:bg-accent-cyan transition-all duration-500 uppercase tracking-widest text-sm shadow-[0_10px_40px_-10px_rgba(132,175,72,0.2)]"
          >
            Initiate Contact
            <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </a>
        </div>
      </section>
    </div>
  );
}
