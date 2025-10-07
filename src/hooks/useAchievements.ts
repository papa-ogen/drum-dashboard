import { useEffect, useState } from "react";
import { mutate } from "swr";
import {
  useExercises,
  useSessions,
  useUserAchievements,
  unlockAchievement,
  API_ENDPOINTS,
} from "../utils/api";
import { evaluateAchievements } from "../utils/achievementChecker";
import { ACHIEVEMENT_DEFINITIONS } from "../data/achievements";
import type { IAchievementDefinition } from "../type";

export interface AchievementWithStatus extends IAchievementDefinition {
  isUnlocked: boolean;
  progress: number;
  currentValue?: number;
  unlockedAt?: string;
}

export function useAchievements() {
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const { userAchievements } = useUserAchievements();
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  // Combine achievement definitions with user progress
  const achievements: AchievementWithStatus[] = ACHIEVEMENT_DEFINITIONS.map(
    (def) => {
      const userProgress = userAchievements?.find(
        (ua) => ua.achievementId === def.id
      );

      // Calculate current progress from sessions
      const evaluated =
        sessions && exercises
          ? evaluateAchievements(sessions, exercises).find(
              (e) => e.achievementId === def.id
            )
          : null;

      return {
        ...def,
        isUnlocked: !!userProgress,
        progress: evaluated?.progress || 0,
        currentValue: evaluated?.currentValue,
        unlockedAt: userProgress?.unlockedAt,
      };
    }
  );

  // Check for newly unlocked achievements
  useEffect(() => {
    if (!sessions || !exercises || !userAchievements) return;

    const checkAndUnlockAchievements = async () => {
      const evaluated = evaluateAchievements(sessions, exercises);

      for (const ev of evaluated) {
        const isAlreadyUnlocked = userAchievements.find(
          (ua) => ua.achievementId === ev.achievementId
        );

        // If 100% progress but not yet unlocked in backend
        if (ev.progress >= 100 && !isAlreadyUnlocked) {
          try {
            const unlockDate = ev.unlockedAt || new Date().toISOString();
            await unlockAchievement(ev.achievementId, unlockDate);

            // Add to newly unlocked list for notifications
            setNewlyUnlocked((prev) => [...prev, ev.achievementId]);

            // Revalidate achievements
            await mutate(API_ENDPOINTS.ACHIEVEMENTS);
          } catch (error) {
            // Silently handle errors (e.g., already unlocked)
            console.log(
              `Achievement ${ev.achievementId} already unlocked or error:`,
              error
            );
          }
        }
      }
    };

    checkAndUnlockAchievements();
  }, [sessions, exercises, userAchievements]);

  const clearNewlyUnlocked = () => {
    setNewlyUnlocked([]);
  };

  return {
    achievements,
    newlyUnlocked,
    clearNewlyUnlocked,
  };
}
