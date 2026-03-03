import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Processing…',
  fullScreen = false
}) => {
  const containerClass = fullScreen
    ? 'min-h-screen bg-obsidian flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center min-h-[400px] bg-white/[0.02] rounded-3xl border border-white/5';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          {/* Inner pulse */}
          <div className="absolute inset-4 bg-accent-cyan rounded-full animate-ping opacity-20"></div>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/10"></div>
          {/* Kinetic arc */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin"
            style={{ animationDuration: '0.6s' }}
            role="status"
            aria-label={message}
          />
        </div>
        <div className="text-center group">
          <p className="text-white font-black uppercase tracking-[0.3em] text-xs mb-1 animate-pulse">
            {message}
          </p>
          <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            Establishing Uplink...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
