import React, { useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Radio, AlertCircle, RefreshCw
} from 'lucide-react';
import { TrackInfo } from '../types';

interface PlayerControlsProps {
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  currentTrack: TrackInfo | null;
  currentIndex: number;
  totalTracks: number;
  error: string | null;
  activePlaylistId?: string;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onOpenPlaylist: () => void;
  onRetry: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isBuffering,
  isMuted,
  volume,
  currentTime,
  duration,
  currentTrack,
  currentIndex,
  totalTracks,
  error,
  activePlaylistId = '',
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onOpenPlaylist,
  onRetry
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isPlaylist1 = activePlaylistId.includes('PLf0nt1Hz_PSo');
  const isPlaylist2 = activePlaylistId.includes('PLVQi9t49CDlnXoIioob2n1V7Q374FYSe3');
  const isCustom = !isPlaylist1 && !isPlaylist2;

  let playlistName = 'Playlist 1 • NH44 Highway Hits';
  if (isPlaylist2) {
    playlistName = 'Playlist 2 • Cold Emotions Mix';
  } else if (isCustom) {
    playlistName = 'Custom Playlist';
  }

  // Time formatter MM:SS or HH:MM:SS
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-0 right-0 z-30 flex justify-center px-3 sm:px-4 pointer-events-auto">
      <div className="w-full max-w-[95vw] sm:max-w-[640px] md:max-w-[680px] bg-gradient-to-r from-[#421b14]/95 via-[#6e281b]/90 to-[#822d1d]/95 backdrop-blur-md rounded-full px-4 sm:px-6 py-2.5 sm:py-3.5 text-amber-50 shadow-[0_12px_45px_rgba(0,0,0,0.75)] border border-white/20 transition-all duration-300">
        
        {/* Error message banner inside player if track fails */}
        {error && (
          <div className="mb-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
            <button
              onClick={onRetry}
              className="px-2.5 py-0.5 rounded-full bg-red-800 hover:bg-red-700 text-red-100 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* MAIN CONTROLS CONTENT - PILL CONTAINER */}
        <div className="flex items-center justify-between gap-3 sm:gap-5">
          
          {/* LEFT SECTION: Circular Vinyl / Album Thumbnail */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/25 shadow-lg group">
            {currentTrack?.thumbnailUrl ? (
              <img
                src={currentTrack.thumbnailUrl}
                alt="Track Artwork"
                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'animate-spin-slow' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-900 text-amber-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
            )}

            {/* Center vinyl hole overlay */}
            <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-stone-900 border-2 border-amber-300/60 shadow-inner"></div>
          </div>

          {/* MIDDLE SECTION: Track Info + Progress Bar & Timers */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 pr-1">
            {/* Song Title (Song 1, Song 2 etc) */}
            <div className="min-w-0 leading-tight">
              <h2 className="text-sm sm:text-base font-bold text-white truncate tracking-wide">
                {`Song ${currentIndex + 1}`}
              </h2>
            </div>

            {/* Clickable Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={handleSeekClick}
              className="relative w-full h-2 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer overflow-hidden group transition-all mt-0.5"
              title="Click to seek"
            >
              <div
                className="absolute top-0 left-0 bottom-0 bg-white rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Glow head */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-amber-100 rounded-full shadow-[0_0_8px_#ffffff] group-hover:scale-125 transition-transform"></div>
              </div>
            </div>

            {/* Time Display: 0:05 / 5:04 */}
            <div className="flex items-center text-xs font-semibold text-white/90 font-mono tracking-wider">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              {isBuffering && (
                <span className="ml-3 text-[10px] text-amber-300 animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></span>
                  Buffering...
                </span>
              )}
            </div>
          </div>

          {/* RIGHT SECTION: Big White Circular Play/Pause */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Main Big White Circular Play / Pause Button */}
            <button
              onClick={onPlayPause}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-stone-900 hover:bg-amber-50 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title={isPlaying ? "Pause (Key: Space)" : "Play (Key: Space)"}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-stone-900" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-stone-900 ml-0.5" />
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
