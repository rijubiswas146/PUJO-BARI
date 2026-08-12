export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
  index: number;
}

export interface StationPreset {
  id: string;
  name: string;
  tagline: string;
  playlistId: string;
  badge: string;
  description: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number; // 0 to 100
  currentTime: number;
  duration: number;
  currentTrack: TrackInfo | null;
  playlistTracks: TrackInfo[];
  currentIndex: number;
  playlistId: string;
  playlistLength: number;
  error: string | null;
  autoplayBlocked: boolean;
}

export interface AppConfig {
  youtubePlaylistId: string;
  spotifyUrl: string;
  youtubeMusicUrl: string;
  defaultStationId: string;
}
