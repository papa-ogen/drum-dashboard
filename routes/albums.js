// routes/albums.js
import { getAllItems, createItem } from "../services/dataService.js";

/**
 * Initialize albums data if it doesn't exist
 * @param {Object} db - The database instance
 */
export async function initializeAlbums(db) {
  await db.read();

  if (!db.data.albums) {
    db.data.albums = [];
    await db.write();
    console.log("Albums initialized successfully.");
  }
}

/**
 * Get all albums
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function getAlbums(req, res, db) {
  try {
    const albums = await getAllItems("albums", db);
    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
}

/**
 * Create a new album
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function createAlbum(req, res, db) {
  try {
    const { id, artist, name, year, artwork } = req.body;

    if (!id || !artist || !name || !year) {
      return res.status(400).json({ error: "Missing required album fields." });
    }

    // Check if album already exists
    await db.read();
    const existingAlbum = db.data.albums?.find((album) => album.id === id);
    if (existingAlbum) {
      return res.status(409).json({ error: "Album already exists." });
    }

    const newAlbum = { id, artist, name, year, artwork };
    await createItem("albums", newAlbum, db);
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ error: "Failed to create album" });
  }
}
