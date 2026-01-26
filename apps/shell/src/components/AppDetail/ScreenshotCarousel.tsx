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
    <section id="screenshots" className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Screenshots
          </h2>
          <p className="text-slate-500 text-sm">
            Explore the features and interface of {app.name}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div
              className="flex transition-transform duration-500"
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
                      className="w-full"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      onError={() => onImageError(index)}
                    />
                  ) : (
                    <div className="w-full aspect-video bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-400 text-sm">Image unavailable</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={onPrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            aria-label="Previous screenshot"
          >
            <ChevronLeftIcon aria-hidden="true" className="w-5 h-5" />
          </button>
          <button
            onClick={onNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            aria-label="Next screenshot"
          >
            <ChevronRightIcon aria-hidden="true" className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToSlide(index)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
                  index === currentSlide
                    ? 'w-6 bg-slate-900'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Caption */}
          <p className="text-center mt-3 text-slate-500 text-sm">
            {screenshots[currentSlide]?.alt}
          </p>
        </div>
      </div>
    </section>
  );
};
