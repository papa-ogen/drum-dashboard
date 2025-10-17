// data/sessionsData.js
import { v4 as uuidv4 } from "uuid";

/**
 * Generate sessions data for given exercises
 * @param {Array} exercises - Array of exercise objects
 * @returns {Array} Array of session objects
 */
export function generateSessionsData(exercises) {
  if (!exercises || exercises.length === 0) {
    return [];
  }

  const sessionData = [
    // Technique 1 sessions (exercises[0])
    { exercise: exercises[0].id, date: "2025-08-18", bpm: 110, time: 120 },
    { exercise: exercises[0].id, date: "2025-08-19", bpm: 110, time: 120 },
    { exercise: exercises[0].id, date: "2025-08-20", bpm: 110, time: 120 },
    { exercise: exercises[0].id, date: "2025-08-21", bpm: 110, time: 120 },
    { exercise: exercises[0].id, date: "2025-08-22", bpm: 111, time: 120 },
    { exercise: exercises[0].id, date: "2025-08-23", bpm: 112, time: 240 },
    { exercise: exercises[0].id, date: "2025-08-24", bpm: 115, time: 240 },
    { exercise: exercises[0].id, date: "2025-08-25", bpm: 115, time: 240 },
    { exercise: exercises[0].id, date: "2025-08-26", bpm: 115, time: 240 },
    { exercise: exercises[0].id, date: "2025-08-27", bpm: 115, time: 240 },
    { exercise: exercises[0].id, date: "2025-08-30", bpm: 116, time: 240 },
    { exercise: exercises[0].id, date: "2025-08-31", bpm: 120, time: 240 },
    { exercise: exercises[0].id, date: "2025-09-01", bpm: 120, time: 240 },
    { exercise: exercises[0].id, date: "2025-09-02", bpm: 120, time: 360 },
    { exercise: exercises[0].id, date: "2025-09-03", bpm: 121, time: 360 },

    // Subdivision Ladder sessions (exercises[1])
    { exercise: exercises[1].id, date: "2025-08-18", bpm: 110, time: 120 },
    { exercise: exercises[1].id, date: "2025-08-19", bpm: 120, time: 120 },
    { exercise: exercises[1].id, date: "2025-08-20", bpm: 120, time: 120 },
    { exercise: exercises[1].id, date: "2025-08-21", bpm: 125, time: 120 },
    { exercise: exercises[1].id, date: "2025-08-22", bpm: 126, time: 120 },
    { exercise: exercises[1].id, date: "2025-08-23", bpm: 127, time: 240 },
    { exercise: exercises[1].id, date: "2025-08-24", bpm: 128, time: 240 },
    { exercise: exercises[1].id, date: "2025-08-25", bpm: 130, time: 240 },
    { exercise: exercises[1].id, date: "2025-08-26", bpm: 130, time: 240 },
    { exercise: exercises[1].id, date: "2025-08-27", bpm: 130, time: 240 },
    { exercise: exercises[1].id, date: "2025-08-30", bpm: 135, time: 240 },
    { exercise: exercises[1].id, date: "2025-08-31", bpm: 135, time: 240 },
    { exercise: exercises[1].id, date: "2025-09-01", bpm: 135, time: 240 },
    { exercise: exercises[1].id, date: "2025-09-02", bpm: 130, time: 360 },
    { exercise: exercises[1].id, date: "2025-09-03", bpm: 135, time: 360 },

    // Weak Leg Builder sessions (exercises[2])
    { exercise: exercises[2].id, date: "2025-08-18", bpm: 90, time: 120 },
    { exercise: exercises[2].id, date: "2025-08-19", bpm: 90, time: 120 },
    { exercise: exercises[2].id, date: "2025-08-20", bpm: 90, time: 120 },
    { exercise: exercises[2].id, date: "2025-08-21", bpm: 90, time: 120 },
    { exercise: exercises[2].id, date: "2025-08-22", bpm: 91, time: 120 },
    { exercise: exercises[2].id, date: "2025-08-23", bpm: 91, time: 240 },
    { exercise: exercises[2].id, date: "2025-08-24", bpm: 91, time: 240 },
    { exercise: exercises[2].id, date: "2025-08-25", bpm: 91, time: 240 },
    { exercise: exercises[2].id, date: "2025-08-26", bpm: 91, time: 240 },
    { exercise: exercises[2].id, date: "2025-08-27", bpm: 91, time: 240 },
    { exercise: exercises[2].id, date: "2025-08-30", bpm: 92, time: 240 },
    { exercise: exercises[2].id, date: "2025-08-31", bpm: 92, time: 240 },
    { exercise: exercises[2].id, date: "2025-09-01", bpm: 92, time: 240 },
    { exercise: exercises[2].id, date: "2025-09-02", bpm: 92, time: 360 },
    { exercise: exercises[2].id, date: "2025-09-03", bpm: 93, time: 360 },

    // Endurance sessions (exercises[3])
    { exercise: exercises[3].id, date: "2025-08-21", bpm: 110, time: 120 },
    { exercise: exercises[3].id, date: "2025-08-22", bpm: 110, time: 120 },
    { exercise: exercises[3].id, date: "2025-08-23", bpm: 110, time: 240 },
    { exercise: exercises[3].id, date: "2025-08-24", bpm: 110, time: 240 },
    { exercise: exercises[3].id, date: "2025-08-25", bpm: 110, time: 240 },
    { exercise: exercises[3].id, date: "2025-08-26", bpm: 110, time: 240 },
    { exercise: exercises[3].id, date: "2025-08-27", bpm: 112, time: 240 },
    { exercise: exercises[3].id, date: "2025-08-30", bpm: 113, time: 240 },
    { exercise: exercises[3].id, date: "2025-08-31", bpm: 113, time: 240 },
    { exercise: exercises[3].id, date: "2025-09-01", bpm: 113, time: 240 },
    { exercise: exercises[3].id, date: "2025-09-02", bpm: 113, time: 360 },
    { exercise: exercises[3].id, date: "2025-09-03", bpm: 115, time: 360 },
  ];

  // Create sessions with proper IDs
  return sessionData.map((session) => ({
    id: uuidv4(),
    ...session,
  }));
}
