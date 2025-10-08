export interface ISegment {
  id: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
}

export interface IExercise {
  id: string;
  name: string;
  segmentId: string;
}

export interface ISession {
  id: string;
  date: string; // YYYY-MM-DD format for backward compatibility
  timestamp?: string; // Full ISO timestamp (e.g., "2025-10-08T14:30:00.000Z")
  exercise: string;
  bpm: number;
  time: number;
}

export type AchievementCategory =
  | "bpm"
  | "consistency"
  | "time"
  | "improvement"
  | "special";
export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface IAchievementDefinition {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string; // Emoji
  criteria: {
    type:
      | "total_sessions"
      | "total_time"
      | "highest_bpm"
      | "bpm_growth"
      | "streak_days"
      | "perfect_week"
      | "exercise_mastery"
      | "segment_complete"
      | "course_complete"
      | "all_achievements";
    threshold: number;
    exerciseId?: string; // For exercise-specific achievements
    segmentId?: string; // For segment-specific achievements
  };
  hidden?: boolean; // Hidden until unlocked
}

export interface IUserAchievement {
  id: string;
  achievementId: string;
  unlockedAt: string; // ISO date when achievement was unlocked
}
