import React from 'react';
import { AppInfo, AppScreenshot } from '../../data/apps';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

interface ScreenshotCarouselProps {
  app: AppInfo;
  screenshots: AppScreenshot[];
  currentSlide: number;
  imageError: Set<number>;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoToSlide: (index: number) => void;
  onImageError: (index: number) => void;
}

export const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  app,
  screenshots,
  currentSlide,
  imageError,
  onPrevSlide,
  onNextSlide,
  onGoToSlide,
  onImageError,
}) => {
  if (screenshots.length <= 1) return null;

  return (
    <section id="screenshots" className="py-8">
      <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-xl overflow-hidden relative group/carousel">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
            Visual Analysis
          </h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
            {app.name} Core Interface
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/20">
            <div
              className="flex transition-transform duration-700 cubic-bezier(0.23, 1, 0.32, 1)"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {screenshots.map((screenshot, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  {!imageError.has(index) ? (
                    <img
                      src={screenshot.url}
                      alt={screenshot.alt}
                      width={1280}
                      height={720}
                      className="w-full opacity-90"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      onError={() => onImageError(index)}
                    />
                  ) : (
                    <div className="w-full aspect-video bg-white/5 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl">
                      <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Data Stream Interrupted</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={onPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-obsidian transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Previous screenshot"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-obsidian transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Next screenshot"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToSlide(index)}
                className={`h-1 rounded-full transition-all ${index === currentSlide
                    ? 'w-10 bg-accent-cyan shadow-[0_0_10px_rgba(6,241,255,0.5)]'
                    : 'w-4 bg-white/10 hover:bg-white/20'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Caption */}
          <div className="mt-6 flex justify-center">
            <p className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              {screenshots[currentSlide]?.alt || 'System Module Display'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
