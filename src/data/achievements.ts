import type { IAchievementDefinition } from "../type";

export const ACHIEVEMENT_DEFINITIONS: IAchievementDefinition[] = [
  // BPM Achievements
  {
    id: "bpm-100",
    name: "Century Club",
    description: "Reach 100 BPM on any exercise",
    category: "bpm",
    tier: "bronze",
    icon: "🥉",
    criteria: { type: "highest_bpm", threshold: 100 },
  },
  {
    id: "bpm-120",
    name: "Speed Demon",
    description: "Reach 120 BPM on any exercise",
    category: "bpm",
    tier: "silver",
    icon: "🥈",
    criteria: { type: "highest_bpm", threshold: 120 },
  },
  {
    id: "bpm-140",
    name: "Lightning Hands",
    description: "Reach 140 BPM on any exercise",
    category: "bpm",
    tier: "gold",
    icon: "🥇",
    criteria: { type: "highest_bpm", threshold: 140 },
  },
  {
    id: "bpm-160",
    name: "Supersonic",
    description: "Reach 160 BPM on any exercise",
    category: "bpm",
    tier: "platinum",
    icon: "💎",
    criteria: { type: "highest_bpm", threshold: 160 },
  },

  // Consistency Achievements
  {
    id: "sessions-10",
    name: "Getting Started",
    description: "Complete 10 total sessions",
    category: "consistency",
    tier: "bronze",
    icon: "🎵",
    criteria: { type: "total_sessions", threshold: 10 },
  },
  {
    id: "sessions-50",
    name: "Dedicated Drummer",
    description: "Complete 50 total sessions",
    category: "consistency",
    tier: "silver",
    icon: "🎶",
    criteria: { type: "total_sessions", threshold: 50 },
  },
  {
    id: "sessions-100",
    name: "Practice Master",
    description: "Complete 100 total sessions",
    category: "consistency",
    tier: "gold",
    icon: "🎼",
    criteria: { type: "total_sessions", threshold: 100 },
  },
  {
    id: "sessions-200",
    name: "Relentless",
    description: "Complete 200 total sessions",
    category: "consistency",
    tier: "platinum",
    icon: "⭐",
    criteria: { type: "total_sessions", threshold: 200 },
  },

  // Time Achievements
  {
    id: "time-10h",
    name: "First 10 Hours",
    description: "Practice for 10 total hours",
    category: "time",
    tier: "bronze",
    icon: "⏰",
    criteria: { type: "total_time", threshold: 36000 }, // 10 hours in seconds
  },
  {
    id: "time-25h",
    name: "Quarter Century",
    description: "Practice for 25 total hours",
    category: "time",
    tier: "silver",
    icon: "⌛",
    criteria: { type: "total_time", threshold: 90000 }, // 25 hours
  },
  {
    id: "time-50h",
    name: "Half Century",
    description: "Practice for 50 total hours",
    category: "time",
    tier: "gold",
    icon: "🕐",
    criteria: { type: "total_time", threshold: 180000 }, // 50 hours
  },
  {
    id: "time-100h",
    name: "Centurion",
    description: "Practice for 100 total hours",
    category: "time",
    tier: "platinum",
    icon: "👑",
    criteria: { type: "total_time", threshold: 360000 }, // 100 hours
  },

  // Improvement Achievements
  {
    id: "growth-10",
    name: "Steady Progress",
    description: "Improve by 10 BPM on any exercise",
    category: "improvement",
    tier: "bronze",
    icon: "📊",
    criteria: { type: "bpm_growth", threshold: 10 },
  },
  {
    id: "growth-25",
    name: "Major Breakthrough",
    description: "Improve by 25 BPM on any exercise",
    category: "improvement",
    tier: "silver",
    icon: "📈",
    criteria: { type: "bpm_growth", threshold: 25 },
  },
  {
    id: "growth-50",
    name: "Quantum Leap",
    description: "Improve by 50 BPM on any exercise",
    category: "improvement",
    tier: "gold",
    icon: "🚀",
    criteria: { type: "bpm_growth", threshold: 50 },
  },
  {
    id: "growth-75",
    name: "Transformation",
    description: "Improve by 75 BPM on any exercise",
    category: "improvement",
    tier: "platinum",
    icon: "✨",
    criteria: { type: "bpm_growth", threshold: 75 },
  },

  // Streak Achievements
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Practice 7 days in a row",
    category: "consistency",
    tier: "bronze",
    icon: "🔥",
    criteria: { type: "streak_days", threshold: 7 },
  },
  {
    id: "streak-14",
    name: "Two Week Streak",
    description: "Practice 14 days in a row",
    category: "consistency",
    tier: "silver",
    icon: "🔥",
    criteria: { type: "streak_days", threshold: 14 },
  },
  {
    id: "streak-30",
    name: "Monthly Dedication",
    description: "Practice 30 days in a row",
    category: "consistency",
    tier: "gold",
    icon: "🔥",
    criteria: { type: "streak_days", threshold: 30 },
  },

  // Special Achievements
  {
    id: "perfect-week",
    name: "Perfect Week",
    description: "Practice every exercise in a single week",
    category: "special",
    tier: "gold",
    icon: "💯",
    criteria: { type: "perfect_week", threshold: 1 },
  },
  {
    id: "exercise-master",
    name: "Exercise Master",
    description: "Complete 20+ sessions on a single exercise",
    category: "special",
    tier: "silver",
    icon: "🎯",
    criteria: { type: "exercise_mastery", threshold: 20 },
  },
];
