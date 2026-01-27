import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppById, checkAppAvailability } from '../services/appsService';
import { isMobileApp } from '../data/apps';
import { BackIcon, ArrowIcon, MobileIcon, ChevronDownIcon, AppleIcon, AndroidIcon } from '../components/Icons';
import { HeroSection, ScreenshotCarousel } from '../components/AppDetail';
import { useCarousel, useLoadApps } from '../hooks';
import '../styles/appDetail.css';

// rerender-lazy-state-init: Initialize Set lazily
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (qrDropdownRef.current && !qrDropdownRef.current.contains(event.target as Node)) {
        setShowQrDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // rerender-memo: Memoize derived values
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

  // rerender-functional-setstate: Use functional update for stable callback
  const handleImageError = useCallback((index: number) => {
    setImageError(prev => new Set(prev).add(index));
  }, []);

  const scrollToScreenshots = () => {
    document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600" role="status" aria-label="Loading app details" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-slate-900 mb-1">App not found</h1>
          <p className="text-slate-500 text-sm mb-4">The requested application does not exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
          >
            <BackIcon aria-hidden="true" className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = app.integrated !== false && isDeployed === true;
  const isChecking = checkingAvailability;
  const hasScreenshots = screenshots.length > 0;
  const heroScreenshot = hasScreenshots && !imageError.has(0) ? screenshots[0] : undefined;

  console.log(`[AppDetail] App: ${app.id}, hasScreenshots: ${hasScreenshots}, count: ${screenshots.length}`, screenshots);
  console.log(`[AppDetail] Mobile check: framework="${app.framework}", isMobile=${isMobileApp(app.framework)}, ios="${app.iosAppUrl || ''}", android="${app.androidAppUrl || ''}"`);

  const isMobile = isMobileApp(app.framework);
  const hasMobileUrls = app.iosAppUrl || app.androidAppUrl;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 rounded-lg px-2 py-1 -ml-2"
              aria-label="Back to home"
            >
              <BackIcon aria-hidden="true" className="w-4 h-4" />
              <span className="hidden sm:inline">All Apps</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">v{app.version}</span>
              {isChecking ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg">
                  <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" role="status" aria-label="Checking availability" />
                  Checking…
                </span>
              ) : isMobile && hasMobileUrls ? (
                /* Mobile App - Show QR Code dropdown */
                <div className="relative" ref={qrDropdownRef}>
                  <button
                    onClick={() => setShowQrDropdown(!showQrDropdown)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                  >
                    <MobileIcon className="w-3 h-3" />
                    Get App
                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${showQrDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* QR Code Dropdown */}
                  {showQrDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 min-w-[320px]">
                      <p className="text-sm font-medium text-slate-900 mb-3 text-center">Scan to Download</p>
                      <div className="flex gap-4 justify-center">
                        {app.iosAppUrl && (
                          <a href={app.iosAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 group-hover:border-slate-300 transition-colors">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(app.iosAppUrl)}`}
                                alt="iOS App QR Code"
                                className="w-24 h-24"
                              />
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
                              <AppleIcon className="w-4 h-4" />
                              <span>iOS</span>
                            </div>
                          </a>
                        )}
                        {app.androidAppUrl && (
                          <a href={app.androidAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 group-hover:border-slate-300 transition-colors">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(app.androidAppUrl)}`}
                                alt="Android App QR Code"
                                className="w-24 h-24"
                              />
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
                              <AndroidIcon className="w-4 h-4 text-green-600" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500"
                >
                  Launch App
                  <ArrowIcon aria-hidden="true" className="w-3 h-3" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-lg cursor-not-allowed">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection
        app={app}
        isChecking={isChecking}
        isAvailable={isAvailable}
        screenshot={heroScreenshot}
        onImageError={() => handleImageError(0)}
        onViewDemo={scrollToScreenshots}
      />

      {/* Screenshots Gallery */}
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

      {/* Mobile App Install QR Code Section */}
      {isMobile && hasMobileUrls && (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600 mb-4">
                    <MobileIcon className="w-4 h-4" />
                    {app.framework} App
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Get the Mobile App
                  </h2>
                  <p className="text-slate-600">
                    Scan the QR code with your phone camera to download and install the app.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  {/* iOS QR Code */}
                  {app.iosAppUrl && (
                    <a href={app.iosAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                      <div className="p-4 bg-white rounded-xl border-2 border-slate-100 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(app.iosAppUrl)}`}
                          alt="iOS App Store QR Code"
                          className="w-40 h-40"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">
                        <AppleIcon className="w-5 h-5" />
                        App Store
                      </div>
                    </a>
                  )}

                  {/* Android QR Code */}
                  {app.androidAppUrl && (
                    <a href={app.androidAppUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                      <div className="p-4 bg-white rounded-xl border-2 border-slate-100 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(app.androidAppUrl)}`}
                          alt="Google Play Store QR Code"
                          className="w-40 h-40"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                        <AndroidIcon className="w-5 h-5" />
                        Google Play
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HTML Content */}
      <main>
        <div
          className="app-detail-content"
          dangerouslySetInnerHTML={{ __html: app.detailContent }}
        />
      </main>

      {/* Floating Action Button - for web apps only */}
      {!isMobile && isAvailable && (
        <div className="fixed bottom-6 right-6 sm:hidden z-40">
          <a
            href={app.path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
            aria-label="Launch App"
          >
            <ArrowIcon aria-hidden="true" className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
  );
}
