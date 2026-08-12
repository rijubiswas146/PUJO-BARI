import React, { useState, useEffect } from 'react';
import { X, Play, Music2, Radio, Compass, PlusCircle, Check, Sparkles, ExternalLink } from 'lucide-react';
import { TrackInfo, StationPreset } from '../types';
import { STATION_PRESETS } from '../config';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: TrackInfo[];
  currentIndex: number;
  currentStationId: string;
  customPlaylistId: string;
  onSelectTrack: (index: number) => void;
  onSelectStation: (station: StationPreset) => void;
  onLoadCustomPlaylist: (playlistId: string) => void;
  isPlaying: boolean;
  initialTab?: 'stations' | 'tracks' | 'custom';
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  isOpen,
  onClose,
  tracks,
  currentIndex,
  currentStationId,
  customPlaylistId,
  onSelectTrack,
  onSelectStation,
  onLoadCustomPlaylist,
  isPlaying,
  initialTab = 'stations'
}) => {
  const [activeTab, setActiveTab] = useState<'stations' | 'tracks' | 'custom'>(initialTab);
  const [inputPlaylistId, setInputPlaylistId] = useState<string>(customPlaylistId || '');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPlaylistId.trim()) return;
    
    // Extract playlist ID if full URL was pasted
    let cleanId = inputPlaylistId.trim();
    if (cleanId.includes('list=')) {
      const match = cleanId.match(/list=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        cleanId = match[1];
      }
    }
    
    onLoadCustomPlaylist(cleanId);
    setActiveTab('tracks');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md h-full glass-panel border-l border-amber-500/30 flex flex-col shadow-2xl p-4 sm:p-6 overflow-hidden">
        
        {/* DRAWER HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-brand text-amber-100 tracking-wide">
                PUJO-BARI
              </h3>
              <p className="text-xs text-amber-300/80">USE YOUR YOUTUBE PLAY LIST ID</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-amber-500/20 text-amber-200 hover:text-amber-50 transition-colors cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-1 my-4 p-1 rounded-xl bg-stone-900/80 border border-amber-500/20">
          <button
            onClick={() => setActiveTab('stations')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'stations'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Stations</span>
          </button>

          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tracks'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Playlist ({tracks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Custom ID</span>
          </button>
        </div>

        {/* TAB 1: STATIONS PRESETS */}
        {activeTab === 'stations' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            <p className="text-xs text-amber-200/60 mb-2 font-medium">Select a playlist use your id :</p>
            {STATION_PRESETS.map((station) => {
              const isSelected = currentStationId === station.id;
              return (
                <div
                  key={station.id}
                  onClick={() => onSelectStation(station)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-400/80 text-amber-50 shadow-lg shadow-amber-950/50'
                      : 'bg-stone-900/60 hover:bg-stone-800/80 border-amber-500/15 text-amber-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider font-mono">
                          {station.badge}
                        </span>
                        <h4 className="font-bold text-sm text-amber-100">{station.name}</h4>
                      </div>
                      <p className="text-xs text-amber-300/80 mt-1 font-medium">{station.tagline}</p>
                      <p className="text-[11px] text-amber-200/60 mt-1 leading-snug">{station.description}</p>
                    </div>

                    {isSelected ? (
                      <span className="p-1.5 rounded-full bg-amber-400 text-stone-950 shrink-0">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-full bg-stone-800 border border-amber-500/20 text-amber-400 shrink-0">
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PLAYLIST TRACKS LIST */}
        {activeTab === 'tracks' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {tracks.length === 0 ? (
              <div className="py-12 text-center text-amber-200/60 space-y-2">
                <Music2 className="w-8 h-8 mx-auto text-amber-500/40" />
                <p className="text-sm">Loading playlist tracks...</p>
              </div>
            ) : (
              tracks.map((track, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={track.id + idx}
                    onClick={() => onSelectTrack(idx)}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/25 border-amber-400/60 text-amber-50 shadow-md'
                        : 'bg-stone-900/40 hover:bg-stone-800/60 border-amber-500/10 text-amber-200/80'
                    }`}
                  >
                    <span className="w-6 text-center text-xs font-mono font-bold text-amber-400/80 shrink-0">
                      {isActive && isPlaying ? (
                        <Sparkles className="w-3.5 h-3.5 mx-auto text-amber-300 animate-spin-slow" />
                      ) : (
                        idx + 1
                      )}
                    </span>

                    <img
                      src={track.thumbnailUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-amber-500/20"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className={`text-xs font-semibold truncate ${isActive ? 'text-amber-200' : 'text-amber-100'}`}>
                        {track.title}
                      </h5>
                      <p className="text-[11px] text-amber-300/70 truncate">{track.artist}</p>
                    </div>

                    {isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold shrink-0">
                        Playing
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM YOUTUBE PLAYLIST */}
        {activeTab === 'custom' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-3">
              <h4 className="font-bold text-sm text-amber-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Play Your Own YouTube Playlist
              </h4>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Enter any public YouTube Playlist ID or paste the full YouTube playlist URL below to play your own custom songs.
              </p>

              <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono text-amber-300/90 mb-1">
                    YouTube Playlist ID / URL:
                  </label>
                  <input
                    type="text"
                    value={inputPlaylistId}
                    onChange={(e) => setInputPlaylistId(e.target.value)}
                    placeholder="e.g. PL4fGSI1pTnk69C3kthL10mN7fI1p_X5yU"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-amber-500/30 text-amber-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Load Playlist
                </button>
              </form>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200/80 space-y-1">
              <p className="font-semibold text-amber-300">💡 Tip:</p>
              <p>You can share YouTube playlists with friends or save custom playlist.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
