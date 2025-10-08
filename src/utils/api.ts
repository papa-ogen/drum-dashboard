import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { ISession, IExercise, ISegment, IUserAchievement } from "../type";

// Use environment variable or default to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// API endpoint constants
export const API_ENDPOINTS = {
  SESSIONS: `${BASE_URL}/sessions`,
  EXERCISES: `${BASE_URL}/exercises`,
  SEGMENTS: `${BASE_URL}/segments`,
  ACHIEVEMENTS: `${BASE_URL}/achievements`,
} as const;

export function useSessions(): {
  sessions: ISession[] | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, isLoading } = useSWR<ISession[]>(
    API_ENDPOINTS.SESSIONS,
    fetcher
  );

  return {
    sessions: data,
    isLoading,
    isError: error,
  };
}

export function useExercises(): {
  exercises: IExercise[] | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, isLoading } = useSWR<IExercise[]>(
    API_ENDPOINTS.EXERCISES,
    fetcher
  );

  return {
    exercises: data,
    isLoading,
    isError: error,
  };
}

export function useSegments(): {
  segments: ISegment[] | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, isLoading } = useSWR<ISegment[]>(
    API_ENDPOINTS.SEGMENTS,
    fetcher
  );

  return {
    segments: data,
    isLoading,
    isError: error,
  };
}

export function useUserAchievements(): {
  userAchievements: IUserAchievement[] | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, isLoading } = useSWR<IUserAchievement[]>(
    API_ENDPOINTS.ACHIEVEMENTS,
    fetcher
  );

  return {
    userAchievements: data,
    isLoading,
    isError: error,
  };
}

export async function postSession(
  session: Omit<ISession, "id">
): Promise<ISession> {
  const response = await fetch(API_ENDPOINTS.SESSIONS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }

  return response.json();
}

export async function unlockAchievement(
  achievementId: string,
  unlockedAt: string
): Promise<IUserAchievement> {
  const response = await fetch(API_ENDPOINTS.ACHIEVEMENTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ achievementId, unlockedAt }),
  });

  if (!response.ok) {
    // 409 means already unlocked, which is fine
    if (response.status === 409) {
      const data = await response.json();
      throw new Error(data.error || "Achievement already unlocked");
    }
    throw new Error(`Failed to unlock achievement: ${response.statusText}`);
  }

  return response.json();
}
