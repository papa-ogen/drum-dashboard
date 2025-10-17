// routes/songs.js
import { getSongsByBpm } from "../services/songService.js";

/**
 * Get songs by BPM
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance (not used for songs, but kept for consistency)
 */
export async function getSongs(req, res, db) {
  try {
    const { bpm, limit = 10 } = req.query;

    if (!bpm) {
      return res.status(400).json({ error: "BPM parameter is required." });
    }

    const targetBpm = parseInt(bpm);
    const songLimit = parseInt(limit);

    const songs = getSongsByBpm(targetBpm, songLimit);
    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(400).json({ error: error.message });
  }
}
