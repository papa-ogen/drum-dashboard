// services/spotifyService.js

/**
 * Service for interacting with Spotify Web API
 */

let accessToken = null;
let tokenExpiry = null;

/**
 * Get Spotify access token using Client Credentials flow
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Spotify auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Subtract 60s for safety

    return accessToken;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

/**
 * Get song recommendations from Spotify based on BPM
 * @param {number} targetBpm - Target BPM
 * @param {number} limit - Number of songs to return
 * @returns {Promise<Array>} Array of song objects
 */
export async function getSpotifyRecommendations(targetBpm, limit = 10) {
  try {
    const token = await getAccessToken();

    // Use popular genres as seed to get diverse recommendations
    const seedGenres = ["pop", "rock", "electronic", "jazz", "funk"];
    const randomGenre =
      seedGenres[Math.floor(Math.random() * seedGenres.length)];

    const params = new URLSearchParams({
      seed_genres: randomGenre,
      target_tempo: targetBpm.toString(),
      limit: Math.min(limit, 20).toString(), // Spotify max is 20
      market: "US",
    });

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.tracks.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      bpm: Math.round(track.tempo || targetBpm), // Use actual tempo if available
      genre: track.artists[0]?.genres?.[0] || "Unknown",
      duration: formatDuration(track.duration_ms),
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url,
      album: track.album.name,
      popularity: track.popularity,
    }));
  } catch (error) {
    console.error("Error fetching Spotify recommendations:", error);
    throw error;
  }
}

/**
 * Search for tracks on Spotify and filter by BPM
 * @param {number} targetBpm - Target BPM
 * @param {number} limit - Number of songs to return
 * @returns {Promise<Array>} Array of song objects
 */
export async function searchSpotifyTracks(targetBpm, limit = 10) {
  try {
    const token = await getAccessToken();

    // Search for popular tracks
    const searchTerms = ["popular", "hits", "classic", "trending"];
    const randomTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const params = new URLSearchParams({
      q: randomTerm,
      type: "track",
      limit: "50", // Get more results to filter by BPM
      market: "US",
    });

    const response = await fetch(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify search error: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks.items;

    // Get audio features for each track to filter by BPM
    const trackIds = tracks.map((track) => track.id).join(",");
    const featuresResponse = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!featuresResponse.ok) {
      throw new Error(`Spotify features error: ${featuresResponse.statusText}`);
    }

    const featuresData = await featuresResponse.json();

    // Filter tracks by BPM (within ±10 BPM range)
    const filteredTracks = tracks
      .map((track, index) => ({
        track,
        features: featuresData.audio_features[index],
      }))
      .filter((item) => {
        if (!item.features) return false;
        const bpmDiff = Math.abs(item.features.tempo - targetBpm);
        return bpmDiff <= 10; // Within 10 BPM
      })
      .slice(0, limit);

    return filteredTracks.map((item) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map((artist) => artist.name).join(", "),
      bpm: Math.round(item.features.tempo),
      genre: "Unknown", // Spotify doesn't provide genre in search results
      duration: formatDuration(item.track.duration_ms),
      previewUrl: item.track.preview_url,
      spotifyUrl: item.track.external_urls.spotify,
      albumArt: item.track.album.images[0]?.url,
      album: item.track.album.name,
      popularity: item.track.popularity,
    }));
  } catch (error) {
    console.error("Error searching Spotify tracks:", error);
    throw error;
  }
}

/**
 * Format duration from milliseconds to MM:SS
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Check if Spotify credentials are configured
 * @returns {boolean} True if credentials are available
 */
export function isSpotifyConfigured() {
  return !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}
