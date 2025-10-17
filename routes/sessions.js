// routes/sessions.js
import {
  createSession as createSessionService,
  getAllSessions,
} from "../services/sessionService.js";
import { generateSessionsData } from "../data/sessionsData.js";

/**
 * Initialize sessions data if it doesn't exist
 * @param {Object} db - The database instance
 */
export async function initializeSessions(db) {
  await db.read();

  if (db.data.sessions.length === 0) {
    console.log("Database is empty. Populating with initial session data...");

    const exercises = db.data.exercises;
    if (!exercises || exercises.length === 0) {
      console.log("No exercises found. Skipping session initialization.");
      return;
    }

    const sessionsData = generateSessionsData(exercises);
    db.data.sessions = sessionsData;

    // Sort sessions by date
    db.data.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    await db.write();
    console.log("Sessions initialized successfully.");
  }
}

/**
 * Get all sessions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function getSessions(req, res, db) {
  try {
    const sessions = await getAllSessions(db);
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

/**
 * Create a new session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function createSession(req, res, db) {
  try {
    const newSession = await createSessionService(req.body, db);
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(400).json({ error: error.message });
  }
}
