// routes/achievements.js
import {
  unlockAchievement,
  getAllUserAchievements,
} from "../services/achievementService.js";

/**
 * Initialize achievements data if it doesn't exist
 * @param {Object} db - The database instance
 */
export async function initializeAchievements(db) {
  await db.read();

  if (!db.data.userAchievements) {
    db.data.userAchievements = [];
    await db.write();
    console.log("User achievements initialized successfully.");
  }
}

/**
 * Get all user achievements
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function getUserAchievements(req, res, db) {
  try {
    const achievements = await getAllUserAchievements(db);
    res.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
}

/**
 * Unlock a new achievement
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} db - Database instance
 */
export async function unlockUserAchievement(req, res, db) {
  try {
    const newAchievement = await unlockAchievement(req.body, db);
    res.status(201).json(newAchievement);
  } catch (error) {
    console.error("Error unlocking achievement:", error);

    if (error.message === "Achievement already unlocked") {
      res.status(409).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}
