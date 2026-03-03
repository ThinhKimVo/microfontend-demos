import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppById, checkAppAvailability } from '../services/appsService';
import { isMobileApp } from '../data/apps';
import { BackIcon, ArrowIcon, MobileIcon, ChevronDownIcon, AppleIcon, AndroidIcon } from '../components/Icons';
import { HeroSection, ScreenshotCarousel } from '../components/AppDetail';
import { useCarousel, useLoadApps } from '../hooks';
import '../styles/appDetail.css';

const emptySet = () => new Set<number>();

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { apps, loading } = useLoadApps();
  const [checkingAvailability, setCheckingAvailability] = useState(true);
  const [isDeployed, setIsDeployed] = useState<boolean | null>(null);
  const [imageError, setImageError] = useState<Set<number>>(emptySet);
  const [showQrDropdown, setShowQrDropdown] = useState(false);
  const qrDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (qrDropdownRef.current && !qrDropdownRef.current.contains(event.target as Node)) {
        setShowQrDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const app = useMemo(
    () => (appId ? getAppById(apps, appId) : undefined),
    [apps, appId]
  );
  const screenshots = useMemo(() => app?.screenshots || [], [app]);
  const { currentSlide, nextSlide, prevSlide, goToSlide } = useCarousel(screenshots.length);

  useEffect(() => {
    if (app) {
      setCheckingAvailability(true);
      checkAppAvailability(app).then((available) => {
        setIsDeployed(available);
        setCheckingAvailability(false);
      });
    }
  }, [app]);

  const handleImageError = useCallback((index: number) => {
    setImageError(prev => new Set(prev).add(index));
  }, []);

  const scrollToScreenshots = () => {
    document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-2 border-accent-cyan/20 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-accent-cyan rounded-full animate-spin"></div>
        </div>
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
        <div className="glass-panel p-12 rounded-[2.5rem] text-center max-w-md border-white/10">
          <h1 className="text-3xl font-black tracking-tight text-white mb-4 uppercase">App not found</h1>
          <p className="text-slate-500 font-mono text-xs mb-8 uppercase tracking-widest">The requested application does not exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-obsidian text-xs font-black rounded-full hover:bg-accent-cyan transition-all uppercase tracking-widest"
          >
            <BackIcon className="w-4 h-4" />
            Abort & Return
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = app.integrated !== false && isDeployed === true;
  const isChecking = checkingAvailability;
  const hasScreenshots = screenshots.length > 0;
  const heroScreenshot = hasScreenshots && !imageError.has(0) ? screenshots[0] : undefined;

  const isMobile = isMobileApp(app.framework);
  const hasMobileUrls = app.iosAppUrl || app.androidAppUrl;

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden pt-20">
      {/* Premium Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[.2em] text-slate-400 hover:text-accent-cyan transition-all"
            >
              <BackIcon className="w-5 h-5 p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-accent-cyan/30 group-hover:-translate-x-1 transition-all" />
              <span className="hidden sm:inline">Registry</span>
            </button>

            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] text-slate-500 hidden sm:inline uppercase tracking-widest select-none">Revision: v{app.version}</span>

              {isChecking ? (
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 border border-accent-cyan/50 border-t-accent-cyan rounded-full animate-spin" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Checking...</span>
                </div>
              ) : isMobile && hasMobileUrls ? (
                <div className="relative" ref={qrDropdownRef}>
                  <button
                    onClick={() => setShowQrDropdown(!showQrDropdown)}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-obsidian text-xs font-black rounded-full hover:bg-accent-cyan transition-all uppercase tracking-widest"
                  >
                    <MobileIcon className="w-3 h-3" />
                    Get App
                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${showQrDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Redesigned QR Dropdown */}
                  {showQrDropdown && (
                    <div className="absolute right-0 top-full mt-4 glass-panel rounded-3xl border-white/10 p-6 z-50 min-w-[340px] shadow-2xl stagger-load">
                      <p className="text-[10px] font-mono font-bold text-slate-500 mb-6 text-center uppercase tracking-[0.2em]">Deployment Uplink</p>
                      <div className="flex gap-6 justify-center">
                        {app.iosAppUrl && (
                          <a href={app.iosAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                            <div className="p-3 bg-white rounded-2xl border border-white/10 group-hover:border-accent-cyan/40 transition-all">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(app.iosAppUrl)}&color=000000&bgcolor=ffffff`}
                                alt="iOS App QR"
                                className="w-24 h-24 grayscale group-hover:grayscale-0 transition-all"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-400 group-hover:text-accent-cyan uppercase tracking-widest">
                              <AppleIcon className="w-4 h-4" />
                              <span>iOS</span>
                            </div>
                          </a>
                        )}
                        {app.androidAppUrl && (
                          <a href={app.androidAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                            <div className="p-3 bg-white rounded-2xl border border-white/10 group-hover:border-accent-emerald/40 transition-all">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(app.androidAppUrl)}&color=000000&bgcolor=ffffff`}
                                alt="Android App QR"
                                className="w-24 h-24 grayscale group-hover:grayscale-0 transition-all"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-400 group-hover:text-accent-cyan uppercase tracking-widest">
                              <AndroidIcon className="w-4 h-4" />
                              <span>Android</span>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : isAvailable ? (
                <a
                  href={app.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-2 bg-white text-obsidian text-xs font-black rounded-full hover:bg-accent-cyan transition-all uppercase tracking-widest"
                >
                  Terminate Guest
                  <ArrowIcon className="w-4 h-4" />
                </a>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                  <span className="w-2 h-2 bg-slate-700 rounded-full" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-600">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-24 stagger-load">
        {/* Hero Section Container */}
        <section className="glass-panel rounded-[3rem] border-white/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-30"></div>
          <HeroSection
            app={app}
            isChecking={isChecking}
            isAvailable={isAvailable}
            screenshot={heroScreenshot}
            onImageError={() => handleImageError(0)}
            onViewDemo={scrollToScreenshots}
          />
        </section>

        {/* Dynamic Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main App Content */}
          <main className="lg:col-span-8">
            <div
              className="app-detail-content glass-panel p-10 md:p-16 rounded-[3rem] border-white/10"
              dangerouslySetInnerHTML={{ __html: app.detailContent }}
            />
          </main>

          {/* Sidebar / Screenshots Gallery */}
          <aside className="lg:col-span-4 space-y-8">
            <ScreenshotCarousel
              app={app}
              screenshots={screenshots}
              currentSlide={currentSlide}
              imageError={imageError}
              onPrevSlide={prevSlide}
              onNextSlide={nextSlide}
              onGoToSlide={goToSlide}
              onImageError={handleImageError}
            />

            {/* Mobile Specific Install Section */}
            {isMobile && hasMobileUrls && (
              <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-6">
                  <MobileIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold mb-4">Mobile Hub</h2>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest text-center mb-8">Deploy to handheld core</p>
                <div className="flex gap-4">
                  {app.iosAppUrl && (
                    <div className="bg-white p-2 rounded-xl border border-white/10">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(app.iosAppUrl)}&color=000000&bgcolor=ffffff`}
                        alt="iOS QR"
                        className="w-20 h-20"
                      />
                    </div>
                  )}
                  {app.androidAppUrl && (
                    <div className="bg-white p-2 rounded-xl border border-white/10">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(app.androidAppUrl)}&color=000000&bgcolor=ffffff`}
                        alt="Android QR"
                        className="w-20 h-20"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Floating Action Button */}
      {!isMobile && isAvailable && (
        <div className="fixed bottom-10 right-10 sm:hidden z-40">
          <a
            href={app.path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-16 h-16 bg-white text-obsidian rounded-full shadow-[0_10px_40px_-10px_rgba(132,175,72,0.2)] hover:bg-accent-cyan transition-all"
            aria-label="Launch Module"
          >
            <ArrowIcon className="w-6 h-6" />
          </a>
        </div>
      )}
    </div>
  );
}
