import React, { useEffect, useRef, useCallback } from 'react';
import { TrackInfo } from '../types';
import { CONFIG } from '../config';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT: any;
  }
}

interface YouTubePlayerProps {
  playlistId: string;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  currentIndex: number;
  onStateChange: (state: {
    isPlaying: boolean;
    isBuffering: boolean;
    currentTime: number;
    duration: number;
    currentTrack: TrackInfo | null;
    currentIndex: number;
    playlistLength: number;
    error: string | null;
  }) => void;
  onAutoplayBlocked: () => void;
  onReady: () => void;
  onPlaylistEnded?: () => void;
  playerRefOut: React.MutableRefObject<any>;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  playlistId,
  volume,
  isMuted,
  isPlaying,
  currentIndex,
  onStateChange,
  onAutoplayBlocked,
  onReady,
  onPlaylistEnded,
  playerRefOut
}) => {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const currentPlaylistIdRef = useRef<string>(playlistId);
  const retryCountRef = useRef<number>(0);

  // Helper to extract track data from active YouTube video
  const updateCurrentTrackData = useCallback(() => {
    if (!playerRef.current || typeof playerRef.current.getVideoData !== 'function') return;

    try {
      const data = playerRef.current.getVideoData();
      const duration = playerRef.current.getDuration() || 0;
      const currentTime = playerRef.current.getCurrentTime() || 0;
      const playlist = playerRef.current.getPlaylist() || [];
      const index = playerRef.current.getPlaylistIndex() || 0;
      const songNum = (typeof index === 'number' && index >= 0) ? index + 1 : 1;

      const displayTitle = `Song ${songNum}`;
      const channelTitle = "পুজো বাড়ি Playlist";

      const trackInfo: TrackInfo = {
        id: data?.video_id || `yt-${index}`,
        title: displayTitle,
        artist: channelTitle,
        thumbnailUrl: data?.video_id 
          ? `https://i.ytimg.com/vi/${data.video_id}/hqdefault.jpg` 
          : "https://files.catbox.moe/6wnn18.png",
        duration: duration,
        index: index
      };

      const tracksList: TrackInfo[] = playlist.map((vId: string, idx: number) => {
        return {
          id: vId || `yt-${idx}`,
          title: `Song ${idx + 1}`,
          artist: "পুজো বাড়ি Playlist",
          thumbnailUrl: vId ? `https://i.ytimg.com/vi/${vId}/hqdefault.jpg` : "https://files.catbox.moe/6wnn18.png",
          duration: idx === index ? duration : 0,
          index: idx
        };
      });

      const state = playerRef.current.getPlayerState();
      const playing = state === window.YT?.PlayerState?.PLAYING;
      const buffering = state === window.YT?.PlayerState?.BUFFERING;

      onStateChange({
        isPlaying: playing,
        isBuffering: buffering,
        currentTime: currentTime,
        duration: duration,
        currentTrack: trackInfo,
        playlistTracks: tracksList.length > 0 ? tracksList : [trackInfo],
        currentIndex: index,
        playlistLength: playlist.length || 1,
        error: null
      });
    } catch (e) {
      console.warn("Failed to update track data:", e);
    }
  }, [onStateChange]);

  // Load YouTube IFrame API script
  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) return;

      // Clean playlist ID if full URL passed
      let cleanPlaylistId = playlistId || CONFIG.youtubePlaylistId;
      if (cleanPlaylistId.includes('list=')) {
        const match = cleanPlaylistId.match(/list=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) cleanPlaylistId = match[1];
      }
      cleanPlaylistId = cleanPlaylistId.split('&')[0].split('?')[0];

      playerRef.current = new window.YT.Player('yt-iframe-player', {
        height: '100%',
        width: '100%',
        playerVars: {
          listType: 'playlist',
          list: cleanPlaylistId,
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : undefined
        },
        events: {
          onReady: (event: any) => {
            playerRefOut.current = event.target;
            event.target.setVolume(isMuted ? 0 : volume);
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }

            // Start regular state poller
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
              if (playerRef.current) {
                updateCurrentTrackData();
              }
            }, 1000);

            onReady();
            updateCurrentTrackData();

            // Attempt initial play
            try {
              event.target.playVideo();
            } catch (err) {
              onAutoplayBlocked();
            }

            // Check if autoplay was prevented by browser security policy and force play if cued
            setTimeout(() => {
              if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
                const state = playerRef.current.getPlayerState();
                if (state !== 1 && state !== 3) { // 1: PLAYING, 3: BUFFERING
                  try {
                    if (typeof playerRef.current.playVideoAt === 'function') {
                      playerRef.current.playVideoAt(0);
                    } else {
                      playerRef.current.playVideo();
                    }
                  } catch (e) {
                    onAutoplayBlocked();
                  }
                }
              }
            }, 1000);
          },

          onStateChange: (event: any) => {
            const YTState = window.YT.PlayerState;
            updateCurrentTrackData();

            if (event.data === YTState.PLAYING) {
              retryCountRef.current = 0; // Reset retries on successful playback
            }

            // Detect when the current playlist finishes its last video
            if (event.data === YTState.ENDED) {
              try {
                const playlist = playerRef.current?.getPlaylist() || [];
                const index = playerRef.current?.getPlaylistIndex();
                
                // Trigger playlist transition ONLY when the last song in the playlist finishes
                if (playlist.length > 0 && (index === playlist.length - 1 || index === -1)) {
                  if (onPlaylistEnded) {
                    onPlaylistEnded();
                  }
                }
              } catch (e) {
                console.warn("Error checking playlist completion:", e);
              }
            }
          },

          onError: (event: any) => {
            console.warn("YouTube Player event error code:", event.data);
            
            // Handle restricted or missing videos by skipping to next track
            if (event.data === 100 || event.data === 101 || event.data === 150) {
              setTimeout(() => {
                if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
                  try {
                    playerRef.current.nextVideo();
                  } catch (e) {}
                }
              }, 500);
            } else if (event.data === 2 || event.data === 5) {
              // Try skipping to next track if parameter or player error on current video
              if (retryCountRef.current < 3) {
                retryCountRef.current += 1;
                setTimeout(() => {
                  if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
                    try {
                      playerRef.current.nextVideo();
                    } catch (e) {}
                  }
                }, 800);
              } else {
                onStateChange({
                  isPlaying: false,
                  isBuffering: false,
                  currentTime: 0,
                  duration: 0,
                  currentTrack: null,
                  currentIndex: 0,
                  playlistLength: 0,
                  error: "Track error. Press Next Track to continue."
                });
              }
            } else {
              onStateChange({
                isPlaying: false,
                isBuffering: false,
                currentTime: 0,
                duration: 0,
                currentTrack: null,
                currentIndex: currentIndex,
                playlistLength: 0,
                error: "Track playback issue. Try Next Track."
              });
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle dynamic playlist switching
  useEffect(() => {
    if (playerRef.current && playlistId) {
      let cleanId = playlistId;
      if (cleanId.includes('list=')) {
        const match = cleanId.match(/list=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) cleanId = match[1];
      }
      cleanId = cleanId.split('&')[0].split('?')[0];

      if (cleanId !== currentPlaylistIdRef.current) {
        currentPlaylistIdRef.current = cleanId;
        retryCountRef.current = 0;

        try {
          if (typeof playerRef.current.loadPlaylist === 'function') {
            playerRef.current.loadPlaylist({
              listType: 'playlist',
              list: cleanId,
              index: 0
            });
            setTimeout(() => {
              try {
                if (typeof playerRef.current.playVideo === 'function') {
                  playerRef.current.playVideo();
                }
              } catch (e) {}
            }, 300);
          }
        } catch (err) {
          console.error("Failed to load playlist:", err);
          try {
            if (typeof playerRef.current.loadPlaylist === 'function') {
              playerRef.current.loadPlaylist(cleanId, 0);
            }
          } catch (e2) {}
        }
      }
    }
  }, [playlistId]);

  return (
    <div className="fixed -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Official YouTube iframe container */}
      <div id="yt-iframe-player" className="w-full h-full" />
    </div>
  );
};

