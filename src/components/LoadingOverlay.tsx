import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-amber-50 p-6 pointer-events-auto transition-opacity duration-700">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center space-y-6">
        
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-pulse" />
        </div>

        {/* Branding Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black font-brand tracking-widest text-amber-100 uppercase">
            PUJO <span className="text-amber-400 italic ml-1">BARI</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-amber-300/80 uppercase">
            MUSIC FOR DURGA PUJO.
          </p>
        </div>

        {/* Animated Status Indicator */}
        <div className="space-y-3 pt-4">
          <p className="text-xs font-mono text-amber-200/90 italic animate-pulse">
            "Starting your journey..."
          </p>
          
          {/* Progress Bar Loader */}
          <div className="w-48 h-1.5 rounded-full bg-stone-800 border border-amber-500/20 overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full animate-pulse" style={{ width: '85%' }} />
          </div>
        </div>

      </div>
    </div>
  );
};
