import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppById } from '../data/apps';

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

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = appId ? getAppById(appId) : undefined;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState<Set<number>>(new Set());

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
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

  const screenshots = app.screenshots || [];
  const hasScreenshots = screenshots.length > 0;
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1 -ml-2"
              aria-label="Back to home"
            >
              <BackIcon />
              <span className="hidden sm:inline">All Apps</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden sm:inline">v{app.version}</span>
              <a
                href={app.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${app.gradient} text-white text-sm font-medium rounded-full motion-safe:transition-all motion-safe:hover:shadow-lg motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500`}
              >
                Launch App
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient */}
      <section className={`relative pt-14 bg-gradient-to-br ${app.gradient} overflow-hidden`}>
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl motion-safe:animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl motion-safe:animate-pulse motion-safe:animation-delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white motion-safe:animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {app.framework}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full motion-safe:animate-pulse" />
                  Online
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                {app.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
                {app.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={app.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-full motion-safe:transition-all motion-safe:hover:scale-105 motion-safe:hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Launch App
                  <ArrowIcon />
                </a>
                {hasScreenshots && (
                  <button
                    onClick={() => document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full motion-safe:transition-all motion-safe:hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <PlayIcon />
                    View Demo
                  </button>
                )}
              </div>
            </div>

            {/* Hero Image/Screenshot */}
            {hasScreenshots && !imageError.has(0) && (
              <div className="relative motion-safe:animate-slide-up motion-safe:animation-delay-200">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl motion-safe:hover:scale-[1.02] motion-safe:transition-transform">
                  <img
                    src={screenshots[0].url}
                    alt={screenshots[0].alt}
                    className="w-full"
                    onError={() => setImageError(prev => new Set(prev).add(0))}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent motion-safe:animate-shine" />
                </div>
                {/* Floating elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/20 rounded-2xl backdrop-blur-sm motion-safe:animate-float" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm motion-safe:animate-float motion-safe:animation-delay-500" />
              </div>
            )}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Screenshots Gallery */}
      {hasScreenshots && screenshots.length > 1 && (
        <section id="screenshots" className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 motion-safe:animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                See it in <span className={`bg-gradient-to-r ${app.gradient} bg-clip-text text-transparent`}>Action</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Explore the features and interface of {app.name}
              </p>
            </div>

            {/* Carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl bg-white">
                <div
                  className="flex motion-safe:transition-transform motion-safe:duration-500"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      {!imageError.has(index) ? (
                        <img
                          src={screenshot.url}
                          alt={screenshot.alt}
                          className="w-full"
                          onError={() => setImageError(prev => new Set(prev).add(index))}
                        />
                      ) : (
                        <div className={`w-full aspect-video bg-gradient-to-br ${app.gradient} opacity-20 flex items-center justify-center`}>
                          <span className="text-slate-500">Image unavailable</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 motion-safe:transition-all motion-safe:hover:scale-110 motion-safe:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-700 motion-safe:transition-all motion-safe:hover:scale-110 motion-safe:hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Next screenshot"
                  >
                    <ChevronRightIcon />
                  </button>
                </>
              )}

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      index === currentSlide
                        ? `w-8 bg-gradient-to-r ${app.gradient}`
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Caption */}
              <p className="text-center mt-4 text-slate-600 font-medium">
                {screenshots[currentSlide]?.alt}
              </p>
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

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <a
          href={app.path}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${app.gradient} text-white rounded-full shadow-lg motion-safe:hover:shadow-xl motion-safe:transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 motion-safe:animate-bounce-slow`}
          aria-label="Launch App"
        >
          <ArrowIcon />
        </a>
      </div>

      {/* CSS for HTML content styling - Minimal Landing Page */}
      <style>{`
        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shine {
          from { transform: translateX(-100%) rotate(45deg); }
          to { transform: translateX(200%) rotate(45deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .motion-safe\\:animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .motion-safe\\:animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .motion-safe\\:animate-float { animation: float 3s ease-in-out infinite; }
        .motion-safe\\:animate-shine { animation: shine 2s ease-in-out infinite; }
        .motion-safe\\:animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .motion-safe\\:animation-delay-200 { animation-delay: 0.2s; }
        .motion-safe\\:animation-delay-500 { animation-delay: 0.5s; }
        .motion-safe\\:animation-delay-1000 { animation-delay: 1s; }

        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-fade-in,
          .motion-safe\\:animate-slide-up,
          .motion-safe\\:animate-float,
          .motion-safe\\:animate-shine,
          .motion-safe\\:animate-bounce-slow {
            animation: none;
          }
        }

        /* Base styles */
        .app-detail-content {
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Full-width sections */
        .app-detail-content section {
          padding: 4rem 1.5rem;
        }
        .app-detail-content section .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .app-detail-content section {
            padding: 5rem 2rem;
          }
        }

        /* Section backgrounds */
        .app-detail-content section.bg-white { background: white; }
        .app-detail-content section.bg-light { background: #f8fafc; }
        .app-detail-content section.bg-dark { background: #0f172a; color: white; }
        .app-detail-content section.bg-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .app-detail-content section.bg-gradient-orange { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; }

        /* Text colors for dark/gradient backgrounds */
        .app-detail-content section.bg-dark h2,
        .app-detail-content section.bg-gradient h2,
        .app-detail-content section.bg-gradient-orange h2 {
          color: white;
        }
        .app-detail-content section.bg-dark .subtitle,
        .app-detail-content section.bg-gradient .subtitle,
        .app-detail-content section.bg-gradient-orange .subtitle {
          color: rgba(255, 255, 255, 0.9);
        }
        .app-detail-content section.bg-dark p,
        .app-detail-content section.bg-gradient p,
        .app-detail-content section.bg-gradient-orange p {
          color: rgba(255, 255, 255, 0.85);
        }
        .app-detail-content section.bg-dark .accent,
        .app-detail-content section.bg-gradient .accent,
        .app-detail-content section.bg-gradient-orange .accent {
          color: #fcd34d;
        }

        /* Scroll Snap - Page swipe effect */
        .app-detail-content.snap-scroll {
          height: calc(100vh - 56px);
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        @media (prefers-reduced-motion: reduce) {
          .app-detail-content.snap-scroll {
            scroll-behavior: auto;
          }
        }
        .app-detail-content.snap-scroll section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          min-height: calc(100vh - 56px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .app-detail-content.snap-scroll section.snap-top {
          justify-content: flex-start;
          padding-top: 3rem;
        }
        .app-detail-content.snap-scroll section.snap-auto {
          min-height: auto;
          scroll-snap-align: none;
        }

        /* Typography */
        .app-detail-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          text-align: center;
        }
        .app-detail-content h2 .accent {
          color: #f97316;
        }
        .app-detail-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .app-detail-content p {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }
        .app-detail-content .subtitle {
          text-align: center;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto 2rem;
        }
        .app-detail-content strong {
          color: #0f172a;
          font-weight: 600;
        }
        .app-detail-content .accent {
          color: #f97316;
        }
        .app-detail-content a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }
        .app-detail-content a:hover {
          text-decoration: underline;
        }
        .app-detail-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .app-detail-content li {
          color: #64748b;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        /* Hero Section */
        .app-detail-content .hero-section {
          text-align: center;
          padding: 2rem 0 3rem;
        }
        .app-detail-content .hero-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        /* Feature Cards Grid */
        .app-detail-content .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .app-detail-content .feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .app-detail-content .feature-card:hover {
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        .app-detail-content .feature-card .icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: -2.5rem auto 1rem;
          font-size: 1.5rem;
        }
        .app-detail-content .feature-card .icon.blue {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }
        .app-detail-content .feature-card .icon.orange {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
        }
        .app-detail-content .feature-card .icon.cyan {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
        }
        .app-detail-content .feature-card .icon.purple {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }
        .app-detail-content .feature-card .icon.green {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }
        .app-detail-content .feature-card h3 {
          color: #1e293b;
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }
        .app-detail-content .feature-card p {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0;
        }

        /* CTA Cards (Image cards with overlay) */
        .app-detail-content .cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .app-detail-content .cta-card {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          aspect-ratio: 4/3;
        }
        .app-detail-content .cta-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .app-detail-content .cta-card .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          color: white;
        }
        .app-detail-content .cta-card h3 {
          color: white;
          font-size: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .app-detail-content .cta-card .btn {
          display: inline-block;
          padding: 0.625rem 1.25rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: transform 0.2s;
          width: fit-content;
        }
        .app-detail-content .cta-card .btn:hover {
          transform: scale(1.05);
          text-decoration: none;
        }
        .app-detail-content .cta-card .btn.light {
          background: rgba(255,255,255,0.9);
          color: #1e293b;
        }
        .app-detail-content .cta-card .btn.orange {
          background: #f97316;
          color: white;
        }
        .app-detail-content .cta-card .btn.blue {
          background: #3b82f6;
          color: white;
        }

        /* Split Section (Text + Image) */
        .app-detail-content .split-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          padding: 2rem 0;
        }
        @media (max-width: 768px) {
          .app-detail-content .split-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .app-detail-content .split-section .content h2 {
          text-align: left;
          font-size: 1.5rem;
          line-height: 1.3;
        }
        .app-detail-content .split-section .content p {
          margin-bottom: 1rem;
        }
        .app-detail-content .split-section .media {
          position: relative;
        }
        .app-detail-content .split-section .media img {
          width: 100%;
          border-radius: 1rem;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
        }
        .app-detail-content .split-section .media .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        .app-detail-content .split-section .media .play-btn::after {
          content: '';
          border-left: 20px solid #1e293b;
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          margin-left: 4px;
        }

        /* Decorative dot */
        .app-detail-content .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-left: 0.5rem;
        }
        .app-detail-content .dot.orange {
          background: #f97316;
        }
        .app-detail-content .dot.blue {
          background: #3b82f6;
        }

        /* Tech Tags */
        .app-detail-content .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .app-detail-content .tech-tag {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
        }
        .app-detail-content .tech-tag.primary {
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          color: white;
        }

        /* Credentials */
        .app-detail-content .credentials {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
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
          border-radius: 0.25rem;
          font-family: monospace;
        }

        /* Stats/Numbers */
        .app-detail-content .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1.5rem;
          text-align: center;
          margin: 2rem 0;
        }
        .app-detail-content .stat-item .number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f97316;
        }
        .app-detail-content .stat-item .label {
          font-size: 0.875rem;
          color: #64748b;
        }

        /* Blockquote/Testimonial */
        .app-detail-content blockquote {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem 0;
          border-left: 4px solid #f97316;
        }
        .app-detail-content blockquote p {
          font-size: 1.125rem;
          font-style: italic;
          margin-bottom: 1rem;
        }
        .app-detail-content blockquote cite {
          font-size: 0.875rem;
          font-style: normal;
          color: #64748b;
        }

        /* Code block */
        .app-detail-content code {
          background: #f1f5f9;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: #0f172a;
        }

        /* Button styles */
        .app-detail-content .btn-primary {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(to right, #f97316, #ea580c);
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .app-detail-content .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
          text-decoration: none;
        }
        .app-detail-content .btn-secondary {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: white;
          color: #1e293b;
          font-weight: 600;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: border-color 0.2s;
        }
        .app-detail-content .btn-secondary:hover {
          border-color: #f97316;
          text-decoration: none;
        }

        /* Image with decorations */
        .app-detail-content .decorated-image {
          position: relative;
        }
        .app-detail-content .decorated-image::before {
          content: '';
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 0.5rem;
          z-index: -1;
        }
      `}</style>
    </div>
  );
}
