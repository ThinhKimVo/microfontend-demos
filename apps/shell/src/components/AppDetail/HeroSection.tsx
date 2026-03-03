import React from 'react';
import { AppInfo, AppScreenshot } from '../../data/apps';
import { ArrowIcon, PlayIcon } from '../Icons';

interface HeroSectionProps {
  app: AppInfo;
  isChecking: boolean;
  isAvailable: boolean;
  screenshot?: AppScreenshot;
  onImageError: () => void;
  onViewDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  app,
  isChecking,
  isAvailable,
  screenshot,
  onImageError,
  onViewDemo,
}) => {
  return (
    <section className="relative overflow-hidden bg-white/5">
      <div className="relative max-w-7xl mx-auto px-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="stagger-load">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-white/10 text-white border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest">
                {app.framework}
              </span>
              {isChecking ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 text-slate-500 rounded-full font-mono text-[10px] uppercase tracking-widest border border-white/5">
                  <span className="w-2 h-2 border border-accent-cyan/50 border-t-accent-cyan rounded-full animate-spin" />
                  Checking Status
                </span>
              ) : isAvailable ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-accent-emerald/10 text-accent-emerald rounded-full font-mono text-[10px] uppercase tracking-widest border border-accent-emerald/20">
                  <span className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
                  Uplink Active
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 bg-accent-magenta/10 text-accent-magenta rounded-full font-mono text-[10px] uppercase tracking-widest border border-accent-magenta/20">
                  <span className="w-2 h-2 bg-accent-magenta rounded-full" />
                  System Offline
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter uppercase leading-[0.9]">
              {app.name}
            </h1>

            <p className="text-slate-400 mb-10 max-w-xl text-lg leading-relaxed font-medium">
              {app.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {isChecking ? (
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 text-slate-500 text-xs font-black rounded-full border border-white/10 uppercase tracking-widest">
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-accent-cyan rounded-full animate-spin" />
                  Synchronizing
                </div>
              ) : isAvailable ? (
                <a
                  href={app.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-white text-obsidian text-xs font-black rounded-full hover:bg-accent-cyan transition-all uppercase tracking-widest shadow-[0_10px_30px_-10px_rgba(132,175,72,0.2)] hover:shadow-accent-cyan/30"
                >
                  Initiate Module
                  <ArrowIcon className="w-4 h-4" />
                </a>
              ) : (
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 text-slate-600 text-xs font-black rounded-full border border-white/5 uppercase tracking-widest cursor-not-allowed">
                  Access Restricted
                </div>
              )}
              {screenshot && (
                <button
                  onClick={onViewDemo}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-black rounded-full hover:bg-white/5 hover:border-white/40 transition-all uppercase tracking-widest"
                >
                  <PlayIcon className="w-4 h-4" />
                  Visual Analysis
                </button>
              )}
            </div>
          </div>

          {/* Hero Image/Screenshot */}
          {screenshot && (
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent-cyan to-accent-emerald opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm relative">
                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  width={640}
                  height={360}
                  className="w-full opacity-90 group-hover:opacity-100 transition-opacity"
                  onError={onImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
