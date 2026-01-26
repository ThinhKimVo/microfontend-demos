import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading…',
  fullScreen = false
}) => {
  const containerClass = fullScreen
    ? 'min-h-screen bg-slate-100 flex items-center justify-center'
    : 'flex items-center justify-center min-h-[400px]';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
          {/* Spinning arc */}
          <div
            className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"
            role="status"
            aria-label={message}
          />
        </div>
        <p className="text-slate-600 font-medium text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
