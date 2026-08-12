import { StationPreset } from './types';

export const CONFIG = {
  // Primary YouTube Playlist IDs for পুজো বাড়ি (Auto-plays Playlist 2 when Playlist 1 finishes)
  defaultPlaylists: [
    "PLf0nt1Hz_PSo",
    "PLVQi9t49CDlnXoIioob2n1V7Q374FYSe3"
  ],
  youtubePlaylistId: "PLf0nt1Hz_PSo", 

  spotifyUrl: "https://open.spotify.com",
  youtubeMusicUrl: "https://music.youtube.com",
  
  // Background Image URL provided for the application
  bgImageUrl: "https://files.catbox.moe/wg67rc.png"
};

export const STATION_PRESETS: StationPreset[] = [
  {
    id: "nh44-highway",
    name: "National Highway 44 (Vol 1)",
    tagline: "Retro Hits & Roadtrip Nostalgia",
    playlistId: "PLf0nt1Hz_PSo",
    badge: "PLAYLIST 1",
    description: "Golden retro classics, 90s highway beats, and timeless melodies for long miles."
  },
  {
    id: "cold-emotions-mix",
    name: "Cold Emotions Mix (Vol 2)",
    tagline: "Chill Highway Tunes & Travel Ballads",
    playlistId: "PLVQi9t49CDlnXoIioob2n1V7Q374FYSe3",
    badge: "PLAYLIST 2",
    description: "Soulful acoustic melodies, highway ballads, and soothing road trip tunes."
  },
  {
    id: "chai-tapri-chills",
    name: "Chai Stall & Lofi",
    tagline: "Acoustic Vibes & Highway Rain",
    playlistId: "PLf0nt1Hz_PSo",
    badge: "TAPRI VIBES",
    description: "Mellow acoustic tunes, gentle monsoon rhythms, and hot cutting chai moments."
  },
  {
    id: "night-overnight-bus",
    name: "Overnight Bus Sunset",
    tagline: "Deep Highway Grooves & Night Lofi",
    playlistId: "PLRBp0Fe2GpgnIh5AiY66f54u9y7fO3M-_",
    badge: "NIGHT CRUISE",
    description: "Dreamy lofi, synth waves, and nocturnal highway sounds."
  }
];

export const STORAGE_KEYS = {
  VOLUME: "onroad_fm_volume",
  MUTED: "onroad_fm_muted",
  STATION_ID: "onroad_fm_station_id",
  CUSTOM_PLAYLIST: "onroad_fm_custom_playlist_id",
  LAST_TRACK_INDEX: "onroad_fm_last_index"
};

