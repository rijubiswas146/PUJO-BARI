import React, { useState, useEffect } from 'react';
import { ExternalLink, Instagram, Maximize2, Minimize2, PlusCircle } from 'lucide-react';

interface TopBarProps {
  onOpenShortcuts: () => void;
  onOpenStations: () => void;
  onOpenCustomPlaylist?: () => void;
  currentStationName?: string;
  activePlaylistId?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenShortcuts,
  onOpenStations,
  onOpenCustomPlaylist,
  currentStationName,
  activePlaylistId = ''
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).toUpperCase()
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-3 sm:px-8 py-2.5 sm:py-4 pt-safe flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      {/* LEFT: Local Time Indicator & Custom Playlist ID Button */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="bg-black/70 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2 border border-amber-500/20 text-amber-100/90 shadow-md min-h-[40px]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-[11px] sm:text-sm font-semibold tracking-wider font-mono">
            {timeString || '12:00 PM'}
          </span>
        </div>

        {/* CUSTOM PLAYLIST ID BUTTON */}
        <button
          onClick={onOpenCustomPlaylist || onOpenStations}
          className="bg-stone-900/90 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 min-h-[40px] flex items-center gap-1.5"
          title="Enter Custom YouTube Playlist ID"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Custom Playlist ID</span>
          <span className="sm:hidden">Custom ID</span>
        </button>
      </div>

      {/* CENTER: Empty spacing or title */}
      <div className="flex items-center gap-2">
      </div>

      {/* RIGHT: Instagram & Fullscreen Control */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Instagram button */}
        <a
          href="https://www.instagram.com/coldemotions_"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-black/70 hover:bg-pink-950/80 text-pink-300 hover:text-pink-100 px-3 py-1.5 rounded-xl border border-pink-500/30 text-xs font-medium transition-all shadow-md hover:scale-105 active:scale-95 min-h-[40px]"
          title="Follow on Instagram"
        >
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Instagram</span>
          <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
        </a>

        {/* Fullscreen toggle button */}
        <button
          onClick={toggleFullscreen}
          className="bg-black/70 hover:bg-amber-500/20 text-amber-200 p-2 rounded-xl border border-amber-500/20 text-xs transition-all cursor-pointer shadow-md active:scale-95 min-w-[42px] min-h-[42px] flex items-center justify-center"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
