// routes/exercises.js
import { getAllItems } from "../services/dataService.js";
import { generateExercisesData } from "../data/exercisesData.js";

/**
 * Initialize exercises data if it doesn't exist
 * @param {Object} db - The database instance
 */
export async function initializeExercises(db) {
  await db.read();

  if (db.data.exercises.length === 0) {
    console.log("Exercises are empty. Populating with initial sample data...");

    const defaultSegmentId = db.data.segments[0]?.id || "segment-1";
    db.data.exercises = generateExercisesData(defaultSegmentId);

    await db.write();
    console.log("Exercises initialized successfully.");
  }
}

/**
 * Get all exercises
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function getExercises(req, res, db) {
  try {
    const exercises = await getAllItems("exercises", db);
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
}
