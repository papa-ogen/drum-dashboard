export interface ISegment {
  id: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
}

export type ExerciseType = "warmup" | "segment" | "cooldown" | "challenge";

export type DrumVoice =
  | "snare"
  | "bass"
  | "hihat"
  | "tom1"
  | "tom2"
  | "tom3"
  | "ride"
  | "crash";

export type NoteValue =
  | "whole" // 1 beat (4/4)
  | "half" // 1/2 beat
  | "quarter" // 1/4 beat
  | "8th" // 1/8 beat
  | "16th" // 1/16 beat
  | "32nd" // 1/32 beat
  | "triplet"; // Triplet subdivision

export interface DrumNote {
  drum: DrumVoice;
  hand?: "R" | "L"; // For hands/sticks
  foot?: "R" | "L"; // For bass drum/hi-hat pedal
  accent?: boolean; // Accented note
  ghost?: boolean; // Ghost note (quiet)
}

export interface NotatedBeat {
  notes: DrumNote[]; // Can have multiple drums hit simultaneously
  value: NoteValue; // Note duration/subdivision
}

export interface IExercise {
  id: string;
  name: string;
  type: ExerciseType;
  segmentId?: string; // Only for type: "segment"
  description?: string;
  defaultDuration?: number;
  defaultBpm?: number;
  notation?: NotatedBeat[]; // Drum notation with note values and subdivisions
}

export interface ISession {
  id: string;
  date: string; // Full ISO timestamp (e.g., "2025-10-08T16:00:00.000Z")
  exercise: string;
  bpm: number;
  time: number;
  readyForFaster?: boolean; // Indicates user is ready to increase BPM next session
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

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  genre: string;
  duration: string;
  previewUrl?: string;
  preview_url?: string; // snake_case for Spotify compatibility
  spotifyUrl?: string;
  spotifyId?: string;
  album?: string;
  albumArt?: string;
  popularity?: number;
}
