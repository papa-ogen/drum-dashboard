import type { IAchievementDefinition, IExercise, ISession } from "../type";
import { ACHIEVEMENT_DEFINITIONS } from "../data/achievements";

export interface EvaluatedAchievement {
  id: string;
  achievementId: string;
  unlockedAt: string;
  progress: number;
  currentValue?: number;
  actualThreshold?: number; // For dynamic thresholds like all_achievements
}

/**
 * Check and calculate progress for all achievements based on session data
 */
export function evaluateAchievements(
  sessions: ISession[],
  exercises: IExercise[],
  unlockedAchievements?: string[] // Array of unlocked achievement IDs
): EvaluatedAchievement[] {
  if (!sessions || sessions.length === 0) return [];

  const evaluatedAchievements: EvaluatedAchievement[] = [];

  ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
    const result = checkAchievement(
      achievement,
      sessions,
      exercises,
      unlockedAchievements || []
    );
    evaluatedAchievements.push(result);
  });

  return evaluatedAchievements;
}

function checkAchievement(
  achievement: IAchievementDefinition,
  sessions: ISession[],
  exercises: IExercise[],
  unlockedAchievements: string[]
): EvaluatedAchievement {
  const { criteria } = achievement;
  let currentValue = 0;
  let threshold = criteria.threshold;
  let unlockedAt: string | undefined;

  switch (criteria.type) {
    case "total_sessions":
      currentValue = sessions.length;
      break;

    case "total_time":
      currentValue = sessions.reduce((acc, s) => acc + s.time, 0);
      break;

    case "highest_bpm":
      currentValue = Math.max(...sessions.map((s) => s.bpm), 0);
      break;

    case "bpm_growth":
      currentValue = calculateMaxBpmGrowth(sessions, exercises);
      break;

    case "streak_days":
      currentValue = calculateLongestStreak(sessions);
      break;

    case "perfect_week":
      currentValue = checkPerfectWeek(sessions) ? 1 : 0;
      break;

    case "exercise_mastery":
      currentValue = calculateMaxSessionsPerExercise(sessions);
      break;

    case "segment_complete":
      currentValue = checkSegmentComplete(
        sessions,
        exercises,
        criteria.segmentId || ""
      )
        ? 1
        : 0;
      break;

    case "course_complete":
      currentValue = checkCourseComplete(sessions, exercises) ? 1 : 0;
      break;

    case "all_achievements": {
      // Count total unlocked (including this one when it unlocks)
      currentValue = unlockedAchievements.length;
      // Override the threshold from definition to be total achievements
      threshold = ACHIEVEMENT_DEFINITIONS.length;

      // Special case: if all others are unlocked, this unlocks too
      const unlockedOthers = unlockedAchievements.filter(
        (id) => id !== achievement.id
      );
      const otherCount = ACHIEVEMENT_DEFINITIONS.length - 1;

      if (unlockedOthers.length >= otherCount) {
        currentValue = threshold; // Force 100% when all others done
      }
      break;
    }

    default:
      currentValue = 0;
  }

  // Calculate progress percentage
  const progress = Math.min((currentValue / threshold) * 100, 100);
  const isUnlocked = currentValue >= threshold;

  // Find when it was unlocked (approximate based on when threshold was reached)
  if (isUnlocked) {
    unlockedAt = findUnlockDate(achievement, sessions, exercises);
  }

  return {
    id: `eval-${achievement.id}`,
    achievementId: achievement.id,
    unlockedAt: unlockedAt || "",
    progress: Math.round(progress),
    currentValue,
    actualThreshold:
      achievement.criteria.type === "all_achievements" ? threshold : undefined,
  };
}

/**
 * Calculate maximum BPM growth across all exercises
 */
function calculateMaxBpmGrowth(
  sessions: ISession[],
  exercises: IExercise[]
): number {
  let maxGrowth = 0;

  exercises.forEach((exercise) => {
    const exerciseSessions = sessions
      .filter((s) => s.exercise === exercise.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (exerciseSessions.length >= 2) {
      const growth =
        exerciseSessions[exerciseSessions.length - 1].bpm -
        exerciseSessions[0].bpm;
      maxGrowth = Math.max(maxGrowth, growth);
    }
  });

  return maxGrowth;
}

/**
 * Calculate longest practice streak in days
 */
function calculateLongestStreak(sessions: ISession[]): number {
  if (sessions.length === 0) return 0;

  const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort();
  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Check if user completed all exercises in any single week
 */
function checkPerfectWeek(sessions: ISession[]): boolean {
  const weekMap: Record<string, Set<string>> = {};

  sessions.forEach((session) => {
    const date = new Date(session.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weekMap[weekKey]) {
      weekMap[weekKey] = new Set();
    }
    weekMap[weekKey].add(session.exercise);
  });

  // Check if any week has all exercises
  const activeExercises = new Set(sessions.map((s) => s.exercise));
  return Object.values(weekMap).some(
    (exercisesInWeek) => exercisesInWeek.size === activeExercises.size
  );
}

/**
 * Calculate maximum sessions for any single exercise
 */
function calculateMaxSessionsPerExercise(sessions: ISession[]): number {
  const exerciseCounts: Record<string, number> = {};

  sessions.forEach((session) => {
    exerciseCounts[session.exercise] =
      (exerciseCounts[session.exercise] || 0) + 1;
  });

  return Math.max(...Object.values(exerciseCounts), 0);
}

/**
 * Find approximate date when achievement was unlocked
 */
function findUnlockDate(
  achievement: IAchievementDefinition,
  sessions: ISession[],
  exercises: IExercise[]
): string {
  const { criteria } = achievement;
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  switch (criteria.type) {
    case "total_sessions":
      return (
        sortedSessions[criteria.threshold - 1]?.date ||
        sortedSessions[sortedSessions.length - 1]?.date ||
        ""
      );

    case "total_time": {
      let accumulated = 0;
      for (const session of sortedSessions) {
        accumulated += session.time;
        if (accumulated >= criteria.threshold) {
          return session.date;
        }
      }
      break;
    }

    case "highest_bpm": {
      const bpmSession = sortedSessions.find(
        (s) => s.bpm >= criteria.threshold
      );
      return bpmSession?.date || "";
    }

    case "bpm_growth": {
      for (const exercise of exercises) {
        const exerciseSessions = sortedSessions.filter(
          (s) => s.exercise === exercise.id
        );
        if (exerciseSessions.length >= 2) {
          const firstBpm = exerciseSessions[0].bpm;
          for (let i = 1; i < exerciseSessions.length; i++) {
            if (exerciseSessions[i].bpm - firstBpm >= criteria.threshold) {
              return exerciseSessions[i].date;
            }
          }
        }
      }
      break;
    }

    case "segment_complete": {
      if (!criteria.segmentId) break;
      const segmentExercises = exercises.filter(
        (ex) => ex.segmentId === criteria.segmentId
      );
      // Find the date when the last required exercise got its first session
      const exerciseDates = segmentExercises
        .map((ex) => {
          const firstSession = sortedSessions.find((s) => s.exercise === ex.id);
          return firstSession?.date || "";
        })
        .filter(Boolean)
        .sort();

      return exerciseDates[exerciseDates.length - 1] || "";
    }

    case "course_complete": {
      // Find the date when the last exercise got its first session
      const exerciseDates = exercises
        .map((ex) => {
          const firstSession = sortedSessions.find((s) => s.exercise === ex.id);
          return firstSession?.date || "";
        })
        .filter(Boolean)
        .sort();

      return exerciseDates[exerciseDates.length - 1] || "";
    }

    case "all_achievements":
      // Use today's date when this unlocks
      return new Date().toISOString().split("T")[0];

    default:
      return sortedSessions[sortedSessions.length - 1]?.date || "";
  }

  return sortedSessions[sortedSessions.length - 1]?.date || "";
}

/**
 * Check if all exercises in a segment have at least one session
 */
function checkSegmentComplete(
  sessions: ISession[],
  exercises: IExercise[],
  segmentId: string
): boolean {
  if (!segmentId) return false;

  const segmentExercises = exercises.filter((ex) => ex.segmentId === segmentId);
  if (segmentExercises.length === 0) return false;

  const exercisesWithSessions = new Set(sessions.map((s) => s.exercise));

  // Check if all segment exercises have at least one session
  return segmentExercises.every((ex) => exercisesWithSessions.has(ex.id));
}

/**
 * Check if all exercises across all segments have at least one session
 */
function checkCourseComplete(
  sessions: ISession[],
  exercises: IExercise[]
): boolean {
  if (exercises.length === 0) return false;

  const exercisesWithSessions = new Set(sessions.map((s) => s.exercise));

  // Check if all exercises have at least one session
  return exercises.every((ex) => exercisesWithSessions.has(ex.id));
}
