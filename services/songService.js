// services/songService.js

/**
 * Service for handling song-related operations
 */

/**
 * Generate mock song data for a given BPM
 * @param {number} targetBpm - The target BPM for songs
 * @param {number} limit - Maximum number of songs to return
 * @returns {Array} Array of song objects
 */
export function generateMockSongs(targetBpm, limit = 10) {
  const genres = [
    "Rock",
    "Pop",
    "Electronic",
    "Jazz",
    "Funk",
    "Blues",
    "Metal",
    "Indie",
    "Alternative",
    "Country",
  ];

  const mockSongs = [];

  for (let i = 1; i <= Math.min(limit, 10); i++) {
    mockSongs.push({
      id: `song-${i}`,
      title: `Song Title ${i}`,
      artist: `Artist Name ${i}`,
      bpm: targetBpm,
      genre: genres[i - 1] || genres[0],
      duration: generateRandomDuration(),
      previewUrl: `https://example.com/preview${i}.mp3`,
      spotifyUrl: `https://open.spotify.com/track/${i}`,
    });
  }

  return mockSongs;
}

/**
 * Generate a random song duration between 2:30 and 6:00
 * @returns {string} Duration in MM:SS format
 */
function generateRandomDuration() {
  const minSeconds = 150; // 2:30
  const maxSeconds = 360; // 6:00
  const totalSeconds =
    Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Get songs by BPM
 * @param {number} bpm - The BPM to search for
 * @param {number} limit - Maximum number of songs to return
 * @returns {Array} Array of songs matching the BPM
 */
export function getSongsByBpm(bpm, limit = 10) {
  if (!bpm || bpm <= 0) {
    throw new Error("Valid BPM is required");
  }

  if (limit <= 0 || limit > 50) {
    throw new Error("Limit must be between 1 and 50");
  }

  return generateMockSongs(bpm, limit);
}
