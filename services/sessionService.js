// services/sessionService.js
import { v4 as uuidv4 } from "uuid";

/**
 * Service for handling session-related operations
 */

/**
 * Validate session data
 * @param {Object} sessionData - The session data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateSession(sessionData) {
  const errors = [];

  if (!sessionData.date) {
    errors.push("Date is required");
  }

  if (!sessionData.exercise) {
    errors.push("Exercise is required");
  }

  if (!sessionData.bpm || sessionData.bpm <= 0) {
    errors.push("Valid BPM is required");
  }

  if (!sessionData.time || sessionData.time <= 0) {
    errors.push("Valid time is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create a new session
 * @param {Object} sessionData - The session data
 * @param {Object} db - The database instance
 * @returns {Object} The created session
 */
export async function createSession(sessionData, db) {
  const validation = validateSession(sessionData);

  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const newSession = {
    id: uuidv4(),
    ...sessionData,
  };

  // Add to database and sort by date
  db.data.sessions.push(newSession);
  db.data.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

  await db.write();
  return newSession;
}

/**
 * Get all sessions
 * @param {Object} db - The database instance
 * @returns {Array} Array of sessions
 */
export async function getAllSessions(db) {
  await db.read();
  return db.data.sessions || [];
}

/**
 * Get sessions by exercise ID
 * @param {string} exerciseId - The exercise ID
 * @param {Object} db - The database instance
 * @returns {Array} Array of sessions for the exercise
 */
export async function getSessionsByExercise(exerciseId, db) {
  await db.read();
  return (db.data.sessions || []).filter(
    (session) => session.exercise === exerciseId
  );
}

/**
 * Get sessions by date range
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @param {Object} db - The database instance
 * @returns {Array} Array of sessions in the date range
 */
export async function getSessionsByDateRange(startDate, endDate, db) {
  await db.read();
  const sessions = db.data.sessions || [];

  return sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return (
      sessionDate >= new Date(startDate) && sessionDate <= new Date(endDate)
    );
  });
}
