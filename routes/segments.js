// routes/segments.js
import { getAllItems } from "../services/dataService.js";
import { segmentsData } from "../data/segmentsData.js";

/**
 * Initialize segments data if it doesn't exist
 * @param {Object} db - The database instance
 */
export async function initializeSegments(db) {
  await db.read();

  if (!db.data.segments || db.data.segments.length === 0) {
    console.log("Segments are empty. Creating 3 segments...");

    db.data.segments = segmentsData;

    await db.write();
    console.log("Segments initialized successfully.");
  }
}

/**
 * Get all segments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function getSegments(req, res, db) {
  try {
    const segments = await getAllItems("segments", db);
    res.json(segments);
  } catch (error) {
    console.error("Error fetching segments:", error);
    res.status(500).json({ error: "Failed to fetch segments" });
  }
}
