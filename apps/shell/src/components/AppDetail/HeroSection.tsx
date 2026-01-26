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
    <section className="relative pt-14 bg-slate-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-xs font-medium">
                {app.framework}
              </span>
              {isChecking ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium">
                  <span className="w-2 h-2 border border-slate-400 border-t-transparent rounded-full animate-spin" role="status" aria-label="Checking status" />
                  Checking…
                </span>
              ) : isAvailable ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  Offline
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900">
              {app.name}
            </h1>
            <p className="text-slate-600 mb-6 max-w-xl">
              {app.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {isChecking ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-500 text-sm font-medium rounded-lg">
                  <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" role="status" aria-label="Checking availability" />
                  Checking…
                </span>
              ) : isAvailable ? (
                <a
                  href={app.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  Launch App
                  <ArrowIcon aria-hidden="true" className="w-4 h-4" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed">
                  Not Available
                </span>
              )}
              {screenshot && (
                <button
                  onClick={onViewDemo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <PlayIcon aria-hidden="true" className="w-4 h-4" />
                  View Demo
                </button>
              )}
            </div>
          </div>

          {/* Hero Image/Screenshot */}
          {screenshot && (
            <div className="relative">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  width={640}
                  height={360}
                  className="w-full"
                  onError={onImageError}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200" />
    </section>
  );
};
