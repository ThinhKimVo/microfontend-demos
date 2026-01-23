import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppById, AppScreenshot } from '../data/apps';

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ReactIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96.77-.16 1.58-.28 2.4-.36.48-.67.99-1.31 1.51-1.9z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const getBaseUrl = () => window.location.origin;

// Screenshot Lightbox Component
interface LightboxProps {
  screenshots: AppScreenshot[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ screenshots, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = screenshots[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
        aria-label="Close lightbox"
      >
        <CloseIcon />
      </button>

      {screenshots.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          aria-label="Previous screenshot"
        >
          <ChevronLeftIcon />
        </button>
      )}

      <div className="max-w-5xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={current.url}
          alt={current.alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        <div className="text-center mt-4">
          <p className="text-white/90 text-sm">{current.alt}</p>
          <p className="text-white/50 text-xs mt-1">{currentIndex + 1} of {screenshots.length}</p>
        </div>
      </div>

      {screenshots.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          aria-label="Next screenshot"
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}

// Screenshot Carousel Component
interface ScreenshotGalleryProps {
  screenshots: AppScreenshot[];
  gradient: string;
}

function ScreenshotGallery({ screenshots, gradient }: ScreenshotGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const openLightbox = () => {
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrev = () => setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  const handleImageError = (index: number) => setFailedImages((prev) => new Set(prev).add(index));

  if (!screenshots || screenshots.length === 0) return null;

  const prevIndex = currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === screenshots.length - 1 ? 0 : currentIndex + 1;

  return (
    <>
      {/* Carousel Container */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
        {/* Main Carousel Area */}
        <div className="relative flex items-center justify-center py-8 px-4 min-h-[400px]">
          {/* Previous Image (Left Side) */}
          {screenshots.length > 1 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 opacity-40 blur-[1px] pointer-events-none hidden md:block">
              <div className="aspect-video rounded-lg overflow-hidden ml-[-50%]">
                {!failedImages.has(prevIndex) ? (
                  <img
                    src={screenshots[prevIndex].url}
                    alt={screenshots[prevIndex].alt}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(prevIndex)}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-30`} />
                )}
              </div>
            </div>
          )}

          {/* Navigation Arrow - Left */}
          {screenshots.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous screenshot"
            >
              <ChevronLeftIcon />
            </button>
          )}

          {/* Main Image (Center) */}
          <button
            onClick={openLightbox}
            className="relative z-5 w-full max-w-3xl mx-auto group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 focus-visible:ring-white rounded-xl"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="aspect-video relative">
                {!failedImages.has(currentIndex) ? (
                  <>
                    <img
                      src={screenshots[currentIndex].url}
                      alt={screenshots[currentIndex].alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      onError={() => handleImageError(currentIndex)}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all scale-0 group-hover:scale-100">
                        <ExpandIcon />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradient} opacity-20`}>
                    <div className="text-slate-400"><ImagePlaceholderIcon /></div>
                    <span className="mt-3 text-sm font-medium text-slate-500">{screenshots[currentIndex].alt}</span>
                  </div>
                )}
              </div>
            </div>
          </button>

          {/* Navigation Arrow - Right */}
          {screenshots.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next screenshot"
            >
              <ChevronRightIcon />
            </button>
          )}

          {/* Next Image (Right Side) */}
          {screenshots.length > 1 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 opacity-40 blur-[1px] pointer-events-none hidden md:block">
              <div className="aspect-video rounded-lg overflow-hidden mr-[-50%]">
                {!failedImages.has(nextIndex) ? (
                  <img
                    src={screenshots[nextIndex].url}
                    alt={screenshots[nextIndex].alt}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(nextIndex)}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-30`} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Caption & Indicators */}
        <div className="bg-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <p className="text-white/90 text-sm font-medium">{screenshots[currentIndex].alt}</p>
            {screenshots.length > 1 && (
              <div className="flex items-center gap-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-6'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to screenshot ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          screenshots={screenshots}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = appId ? getAppById(appId) : undefined;

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">App not found</h1>
          <p className="text-slate-600 mb-4">The requested application does not exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BackIcon />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Back to home"
              >
                <BackIcon />
              </button>
              <nav className="ml-4 flex items-center text-sm" aria-label="Breadcrumb">
                <Link to="/" className="text-slate-500 hover:text-slate-700 transition-colors">Apps</Link>
                <svg className="w-4 h-4 mx-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-slate-900">{app.name}</span>
              </nav>
            </div>
            <Link
              to={app.path}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${app.gradient} text-white text-sm font-medium rounded-lg transition-shadow hover:shadow-md`}
            >
              Launch
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`bg-gradient-to-r ${app.gradient} rounded-2xl overflow-hidden shadow-xl mb-8`}>
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="p-5 bg-white/20 rounded-2xl backdrop-blur-sm w-fit shadow-lg">
                <ReactIcon />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{app.name}</h1>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm text-white">
                    {app.framework}
                  </span>
                  <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1.5 text-white">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-white/90 text-lg max-w-2xl">{app.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots Carousel - Full Width */}
        {app.screenshots.length > 0 && (
          <div className="mb-8">
            <ScreenshotGallery screenshots={app.screenshots} gradient={app.gradient} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - HTML */}
          <div className="lg:col-span-2 space-y-6">
            {/* HTML Content */}
            <div
              className="app-detail-content bg-white rounded-2xl border border-slate-200 p-6"
              dangerouslySetInnerHTML={{ __html: app.detailContent }}
            />
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <Link
                to={app.path}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${app.gradient} text-white font-medium rounded-xl transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500`}
              >
                Launch App
                <ArrowIcon />
              </Link>
              <a
                href={`${getBaseUrl()}${app.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full mt-3 flex items-center justify-center gap-2 px-6 py-3 border-2 ${app.borderColor} ${app.textColor} font-medium rounded-xl transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500`}
              >
                Open in New Tab
                <ExternalLinkIcon />
              </a>

              {/* Technical Info */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Technical Info</h4>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Port</dt>
                    <dd className="font-mono text-slate-900">{app.port}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Version</dt>
                    <dd className="font-mono text-slate-900">v{app.version}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Updated</dt>
                    <dd className="text-slate-900">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(app.lastUpdated))}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CSS for HTML content styling */}
      <style>{`
        .app-detail-content section {
          margin-bottom: 2rem;
        }
        .app-detail-content section:last-child {
          margin-bottom: 0;
        }
        .app-detail-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .app-detail-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .app-detail-content p {
          color: #475569;
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }
        .app-detail-content strong {
          color: #0f172a;
          font-weight: 600;
        }
        .app-detail-content em {
          color: #6366f1;
        }
        .app-detail-content a {
          color: #6366f1;
          text-decoration: underline;
        }
        .app-detail-content a:hover {
          color: #4f46e5;
        }
        .app-detail-content blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
        }
        .app-detail-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .app-detail-content li {
          color: #475569;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .app-detail-content code {
          background: #f1f5f9;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: #0f172a;
        }
        .app-detail-content .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .app-detail-content .tech-tag {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
        }
        .app-detail-content .tech-tag.primary {
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          color: white;
        }
        .app-detail-content .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        .app-detail-content .feature-card {
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
        }
        .app-detail-content .feature-card h3 {
          margin-bottom: 0.5rem;
        }
        .app-detail-content .feature-card p {
          font-size: 0.875rem;
          margin-bottom: 0;
        }
        .app-detail-content .credentials {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .app-detail-content .credential-item {
          padding: 1rem;
          background: #fef3c7;
          border-radius: 0.5rem;
        }
        .app-detail-content .credential-item .label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #92400e;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .app-detail-content .credential-item code {
          background: #451a03;
          color: #fbbf24;
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
}
