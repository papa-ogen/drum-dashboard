// services/spotifyService.js

import { getSongsInBpmRange } from "../data/songs.js";

/**
 * Service for interacting with Spotify Web API and local song data
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
 * Get songs from local data based on BPM range
 * @param {number} targetBpm - Target BPM
 * @param {number} limit - Number of songs to return
 * @param {number} tolerance - BPM tolerance range (default: 10)
 * @returns {Array} Array of song objects
 */
export function getSongsByBpm(targetBpm, limit = 10, tolerance = 10) {
  const minBpm = Math.max(0, targetBpm - tolerance);
  const maxBpm = targetBpm + tolerance;

  const songsInRange = getSongsInBpmRange(minBpm, maxBpm);

  // Shuffle and limit results
  const shuffled = songsInRange.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/**
 * Get song recommendations - tries local data first, falls back to Spotify tracks API
 * @param {number} targetBpm - Target BPM
 * @param {number} limit - Number of songs to return
 * @param {number} tolerance - BPM tolerance range (default: 10)
 * @returns {Promise<Array>} Array of song objects
 */
export async function getSongRecommendations(
  targetBpm,
  limit = 10,
  tolerance = 10
) {
  // First try local data
  const localSongs = getSongsByBpm(targetBpm, limit, tolerance);

  if (localSongs.length > 0) {
    console.log(
      `Found ${localSongs.length} songs from local data for BPM ${targetBpm}`
    );
    return localSongs;
  }

  // Fallback to Spotify tracks API if no local songs found
  console.log(
    `No local songs found for BPM ${targetBpm}, trying Spotify tracks...`
  );
  try {
    return await getSpotifyTracks(targetBpm, limit);
  } catch (error) {
    console.error("Spotify tracks API failed:", error);
    return [];
  }
}

/**
 * Get tracks from Spotify using track IDs from local data
 * @param {number} targetBpm - Target BPM
 * @param {number} limit - Number of songs to return
 * @returns {Promise<Array>} Array of song objects
 */
export async function getSpotifyTracks(targetBpm, limit = 10) {
  try {
    const token = await getAccessToken();

    // Get songs with Spotify IDs from our local data
    const songsWithIds = getSongsInBpmRange(targetBpm - 10, targetBpm + 10)
      .filter((song) => song.spotifyId)
      .slice(0, limit);

    if (songsWithIds.length === 0) {
      console.log("No songs with Spotify IDs found for BPM", targetBpm);
      return [];
    }

    // Get track IDs
    const trackIds = songsWithIds.map((song) => song.spotifyId).join(",");

    const response = await fetch(
      `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Spotify tracks API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data.tracks
      .filter((track) => track) // Remove null tracks
      .map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        bpm: songsWithIds.find((s) => s.spotifyId === track.id)?.bpm || 0,
        duration: formatDuration(track.duration_ms),
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        albumArt: track.album.images[0]?.url,
        album: track.album.name,
        popularity: track.popularity,
      }));
  } catch (error) {
    console.error("Error fetching Spotify tracks:", error);
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
