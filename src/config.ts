import { StationPreset } from './types';

export const CONFIG = {
  // Primary YouTube Playlist IDs for পুজো বাড়ি (Auto-plays Playlist 2 when Playlist 1 finishes)
  defaultPlaylists: [
    "PLGRusc1mK-h8",
    "PLpCe_Y6h7iQjW8dpbkHLtjiY8vV2zFQSm"
  ],
  youtubePlaylistId: "PLGRusc1mK-h8", 

  spotifyUrl: "https://open.spotify.com",
  youtubeMusicUrl: "https://music.youtube.com",
  
  // Background Image URL provided for the application
  bgImageUrl: "https://files.catbox.moe/wg67rc.png"
};


export const STORAGE_KEYS = {
  VOLUME: "onroad_fm_volume",
  MUTED: "onroad_fm_muted",
  STATION_ID: "onroad_fm_station_id",
  CUSTOM_PLAYLIST: "onroad_fm_custom_playlist_id",
  LAST_TRACK_INDEX: "onroad_fm_last_index"
};

