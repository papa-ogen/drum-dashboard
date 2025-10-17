// services/achievementService.js
import { v4 as uuidv4 } from "uuid";

/**
 * Service for handling achievement-related operations
 */

/**
 * Validate achievement unlock data
 * @param {Object} achievementData - The achievement data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateAchievementUnlock(achievementData) {
  const errors = [];

  if (!achievementData.achievementId) {
    errors.push("Achievement ID is required");
  }

  if (!achievementData.unlockedAt) {
    errors.push("Unlock date is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if achievement is already unlocked
 * @param {string} achievementId - The achievement ID
 * @param {Object} db - The database instance
 * @returns {boolean} True if already unlocked
 */
export async function isAchievementUnlocked(achievementId, db) {
  await db.read();
  return db.data.userAchievements.some(
    (achievement) => achievement.achievementId === achievementId
  );
}

/**
 * Unlock a new achievement
 * @param {Object} achievementData - The achievement data
 * @param {Object} db - The database instance
 * @returns {Object} The unlocked achievement
 */
export async function unlockAchievement(achievementData, db) {
  const validation = validateAchievementUnlock(achievementData);

  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  // Check if already unlocked
  const alreadyUnlocked = await isAchievementUnlocked(
    achievementData.achievementId,
    db
  );
  if (alreadyUnlocked) {
    throw new Error("Achievement already unlocked");
  }

  const newAchievement = {
    id: uuidv4(),
    achievementId: achievementData.achievementId,
    unlockedAt: achievementData.unlockedAt,
  };

  db.data.userAchievements.push(newAchievement);
  await db.write();

  return newAchievement;
}

/**
 * Get all user achievements
 * @param {Object} db - The database instance
 * @returns {Array} Array of user achievements
 */
export async function getAllUserAchievements(db) {
  await db.read();
  return db.data.userAchievements || [];
}

/**
 * Get achievements by category
 * @param {string} category - The achievement category
 * @param {Object} db - The database instance
 * @returns {Array} Array of achievements in the category
 */
export async function getAchievementsByCategory(category, db) {
  await db.read();
  return (db.data.userAchievements || []).filter(
    (achievement) => achievement.category === category
  );
}
