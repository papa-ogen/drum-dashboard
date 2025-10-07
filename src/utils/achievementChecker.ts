import type { IAchievementDefinition, IExercise, ISession } from "../type";
import { ACHIEVEMENT_DEFINITIONS } from "../data/achievements";

export interface EvaluatedAchievement {
  id: string;
  achievementId: string;
  unlockedAt: string;
  progress: number;
  currentValue?: number;
}

/**
 * Check and calculate progress for all achievements based on session data
 */
export function evaluateAchievements(
  sessions: ISession[],
  exercises: IExercise[]
): EvaluatedAchievement[] {
  if (!sessions || sessions.length === 0) return [];

  const evaluatedAchievements: EvaluatedAchievement[] = [];

  ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
    const result = checkAchievement(achievement, sessions, exercises);
    evaluatedAchievements.push(result);
  });

  return evaluatedAchievements;
}

function checkAchievement(
  achievement: IAchievementDefinition,
  sessions: ISession[],
  exercises: IExercise[]
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
      currentValue = checkPerfectWeek(sessions, exercises) ? 1 : 0;
      break;

    case "exercise_mastery":
      currentValue = calculateMaxSessionsPerExercise(sessions);
      break;

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
function checkPerfectWeek(
  sessions: ISession[],
  exercises: IExercise[]
): boolean {
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

    default:
      return sortedSessions[sortedSessions.length - 1]?.date || "";
  }

  return sortedSessions[sortedSessions.length - 1]?.date || "";
}
