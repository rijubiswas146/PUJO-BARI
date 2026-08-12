import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { MainBranding } from './components/MainBranding';
import { PlayerControls } from './components/PlayerControls';
import { PlaylistDrawer } from './components/PlaylistDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AutoplayPrompt } from './components/AutoplayPrompt';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AdPopup } from './components/AdPopup';
import { YouTubePlayer } from './components/YouTubePlayer';
import { CONFIG, STATION_PRESETS, STORAGE_KEYS } from './config';
import { TrackInfo, StationPreset, PlayerState } from './types';

export default function App() {
  // App initialization state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [showStationsDrawer, setShowStationsDrawer] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'stations' | 'tracks' | 'custom'>('stations');
  const [showAdPopup, setShowAdPopup] = useState<boolean>(() => {
    return !sessionStorage.getItem('has_seen_7s_ad_v1');
  });

  // Station and Playlist state
  const [currentStation, setCurrentStation] = useState<StationPreset>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.STATION_ID);
    const found = STATION_PRESETS.find(s => s.id === savedId);
    return found || STATION_PRESETS[0];
  });

  const [activePlaylistId, setActivePlaylistId] = useState<string>(() => {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_PLAYLIST);
    if (custom) return custom;
    const savedStationId = localStorage.getItem(STORAGE_KEYS.STATION_ID);
    const found = STATION_PRESETS.find(s => s.id === savedStationId);
    return found?.playlistId || CONFIG.youtubePlaylistId;
  });

  // Audio Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isBuffering: false,
    isMuted: localStorage.getItem(STORAGE_KEYS.MUTED) === 'true',
    volume: Number(localStorage.getItem(STORAGE_KEYS.VOLUME) ?? 80),
    currentTime: 0,
    duration: 0,
    currentTrack: null,
    playlistTracks: [],
    currentIndex: 0,
    playlistId: activePlaylistId,
    playlistLength: 0,
    error: null,
    autoplayBlocked: false
  });

  // Ref to YouTube API Instance
  const ytPlayerRef = useRef<any>(null);

  // Handle YouTube player state updates
  const handleYTStateChange = useCallback((newState: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...newState }));
  }, []);

  // Controls Handlers
  const handlePlayPause = () => {
    if (!ytPlayerRef.current) return;
    try {
      const currentState = typeof ytPlayerRef.current.getPlayerState === 'function' 
        ? ytPlayerRef.current.getPlayerState() 
        : -1;

      if (currentState === 1) { // 1 = PLAYING
        ytPlayerRef.current.pauseVideo();
      } else {
        if (typeof ytPlayerRef.current.isMuted === 'function' && ytPlayerRef.current.isMuted()) {
          if (!playerState.isMuted && typeof ytPlayerRef.current.unMute === 'function') {
            ytPlayerRef.current.unMute();
          }
        }
        
        ytPlayerRef.current.playVideo();
        setShowAutoplayPrompt(false);

        // Fallback if player was cued or stuck
        setTimeout(() => {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
            const st = ytPlayerRef.current.getPlayerState();
            if (st !== 1 && st !== 3) { // Not playing and not buffering
              if (typeof ytPlayerRef.current.playVideoAt === 'function') {
                ytPlayerRef.current.playVideoAt(0);
              } else {
                ytPlayerRef.current.playVideo();
              }
            }
          }
        }, 400);
      }
    } catch (e) {
      console.warn("PlayPause failed:", e);
    }
  };

  const lastPlaylistEndedTimeRef = useRef<number>(0);

  // Handle playlist rotation when a playlist ends
  const handlePlaylistEnded = useCallback(() => {
    const now = Date.now();
    if (now - lastPlaylistEndedTimeRef.current < 3000) {
      return;
    }
    lastPlaylistEndedTimeRef.current = now;

    const cleanCurrentId = activePlaylistId.includes('list=')
      ? activePlaylistId.match(/list=([a-zA-Z0-9_-]+)/)?.[1] || activePlaylistId
      : activePlaylistId.split('&')[0].split('?')[0];

    const currentIdx = CONFIG.defaultPlaylists.findIndex(id => id === cleanCurrentId);
    let nextPlaylistId = CONFIG.defaultPlaylists[1];

    if (currentIdx !== -1) {
      const nextIdx = (currentIdx + 1) % CONFIG.defaultPlaylists.length;
      nextPlaylistId = CONFIG.defaultPlaylists[nextIdx];
    }
    
    const matchingStation = STATION_PRESETS.find(s => s.playlistId === nextPlaylistId);
    if (matchingStation) {
      setCurrentStation(matchingStation);
      localStorage.setItem(STORAGE_KEYS.STATION_ID, matchingStation.id);
    }
    
    setActivePlaylistId(nextPlaylistId);
  }, [activePlaylistId]);

  const handlePrevious = () => {
    if (!ytPlayerRef.current) return;
    try {
      ytPlayerRef.current.previousVideo();
    } catch (e) {
      console.warn("Previous track failed:", e);
    }
  };

  const handleNext = () => {
    if (!ytPlayerRef.current) return;
    try {
      if (playerState.currentIndex >= playerState.playlistLength - 1 && playerState.playlistLength > 0) {
        handlePlaylistEnded();
      } else {
        ytPlayerRef.current.nextVideo();
      }
    } catch (e) {
      console.warn("Next track failed:", e);
    }
  };

  const handleSeek = (seconds: number) => {
    if (!ytPlayerRef.current) return;
    try {
      ytPlayerRef.current.seekTo(seconds, true);
    } catch (e) {
      console.warn("Seek failed:", e);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume));
    setPlayerState(prev => ({ ...prev, volume: clamped, isMuted: clamped === 0 }));
    localStorage.setItem(STORAGE_KEYS.VOLUME, clamped.toString());

    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setVolume(clamped);
        if (clamped > 0 && ytPlayerRef.current.isMuted()) {
          ytPlayerRef.current.unMute();
          localStorage.setItem(STORAGE_KEYS.MUTED, 'false');
        }
      } catch (e) {}
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !playerState.isMuted;
    setPlayerState(prev => ({ ...prev, isMuted: nextMuted }));
    localStorage.setItem(STORAGE_KEYS.MUTED, nextMuted.toString());

    if (ytPlayerRef.current) {
      try {
        if (nextMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      } catch (e) {}
    }
  };

  const handleSelectTrack = (index: number) => {
    if (!ytPlayerRef.current) return;
    try {
      ytPlayerRef.current.playVideoAt(index);
      setShowStationsDrawer(false);
    } catch (e) {
      console.warn("Select track failed:", e);
    }
  };

  const handleSelectStation = (station: StationPreset) => {
    setCurrentStation(station);
    setActivePlaylistId(station.playlistId);
    localStorage.setItem(STORAGE_KEYS.STATION_ID, station.id);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_PLAYLIST);
    setShowStationsDrawer(false);
  };

  const handleLoadCustomPlaylist = (customId: string) => {
    setActivePlaylistId(customId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PLAYLIST, customId);
    setCurrentStation({
      id: 'custom-user-playlist',
      name: 'Custom Roadtrip',
      tagline: 'Personal YouTube Playlist',
      playlistId: customId,
      badge: 'CUSTOM',
      description: 'User loaded custom YouTube playlist'
    });
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in form inputs
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'KeyN':
          e.preventDefault();
          handleNext();
          break;
        case 'KeyP':
          e.preventDefault();
          handlePrevious();
          break;
        case 'KeyM':
          e.preventDefault();
          handleToggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, playerState.currentTime - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(playerState.duration, playerState.currentTime + 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(playerState.volume + 10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(playerState.volume - 10);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerState.currentTime, playerState.duration, playerState.volume, playerState.isPlaying]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-body select-none">
      
      {/* 1. CINEMATIC HAND-PAINTED BACKGROUND IMAGE WITH SUBTLE ANIMATED ZOOM */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 animate-slow-zoom"
          style={{
            backgroundImage: `url('${CONFIG.bgImageUrl}')`
          }}
        />

        {/* Subtle dark transparent overlay for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
      </div>

      {/* 2. TOP BAR */}
      <TopBar
        onOpenShortcuts={() => setShowShortcuts(true)}
        onOpenStations={() => {
          setDrawerTab('stations');
          setShowStationsDrawer(true);
        }}
        onOpenCustomPlaylist={() => {
          setDrawerTab('custom');
          setShowStationsDrawer(true);
        }}
        currentStationName={currentStation.name}
        activePlaylistId={activePlaylistId}
      />

      {/* 3. MAIN পুজো বাড়ি BRANDING */}
      <MainBranding
        onOpenStations={() => setShowStationsDrawer(true)}
        currentStationName={currentStation.name}
        isPlaying={playerState.isPlaying}
      />

      {/* 4. CUSTOM FLOATING PLAYER UI */}
      <PlayerControls
        isPlaying={playerState.isPlaying}
        isBuffering={playerState.isBuffering}
        isMuted={playerState.isMuted}
        volume={playerState.volume}
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        currentTrack={playerState.currentTrack}
        currentIndex={playerState.currentIndex}
        totalTracks={playerState.playlistLength}
        error={playerState.error}
        activePlaylistId={activePlaylistId}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onOpenPlaylist={() => setShowStationsDrawer(true)}
        onRetry={handlePlayPause}
      />

      {/* 5. HIDDEN EMBEDDED OFFICIAL YOUTUBE PLAYER */}
      <YouTubePlayer
        playlistId={activePlaylistId}
        volume={playerState.volume}
        isMuted={playerState.isMuted}
        isPlaying={playerState.isPlaying}
        currentIndex={playerState.currentIndex}
        onStateChange={handleYTStateChange}
        onAutoplayBlocked={() => setShowAutoplayPrompt(true)}
        onReady={() => setIsLoading(false)}
        onPlaylistEnded={handlePlaylistEnded}
        playerRefOut={ytPlayerRef}
      />

      {/* 6. PLAYLIST & STATIONS DRAWER */}
      <PlaylistDrawer
        isOpen={showStationsDrawer}
        onClose={() => setShowStationsDrawer(false)}
        initialTab={drawerTab}
        tracks={playerState.playlistTracks}
        currentIndex={playerState.currentIndex}
        currentStationId={currentStation.id}
        customPlaylistId={activePlaylistId}
        onSelectTrack={handleSelectTrack}
        onSelectStation={handleSelectStation}
        onLoadCustomPlaylist={handleLoadCustomPlaylist}
        isPlaying={playerState.isPlaying}
      />

      {/* 7. KEYBOARD SHORTCUTS MODAL */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* 8. AUTOPLAY REQUIREMENT PROMPT OVERLAY */}
      {showAutoplayPrompt && (
        <AutoplayPrompt
          onTapToPlay={() => {
            setShowAutoplayPrompt(false);
            handlePlayPause();
          }}
          stationName={currentStation.name}
        />
      )}

      {/* 9. 7-SECOND AD POPUP OVERLAY (SHOWS ONCE PER SESSION) */}
      {showAdPopup && (
        <AdPopup
          onClose={() => {
            setShowAdPopup(false);
            sessionStorage.setItem('has_seen_7s_ad_v1', 'true');
          }}
        />
      )}

      {/* 10. INITIAL LOADING SCREEN */}
      <LoadingOverlay isVisible={isLoading} />

    </div>
  );
}
