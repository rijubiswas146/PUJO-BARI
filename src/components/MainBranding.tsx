import React from 'react';

interface MainBrandingProps {
  onOpenStations: () => void;
  currentStationName?: string;
  isPlaying?: boolean;
}

export const MainBranding: React.FC<MainBrandingProps> = ({
  isPlaying
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 pointer-events-none select-none text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-3 sm:space-y-4">
        
        {/* Subtle Indian Travel Badge */}
      

        {/* Main Brand Title */}
        <div className="relative">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-amber-50 drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] leading-tight">
            
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-lg md:text-xl font-medium tracking-[0.25em] text-amber-100/90 uppercase font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-md">
          .
        </p>

      </div>
    </div>
  );
};
