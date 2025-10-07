import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { ISession, IExercise, ISegment } from "../type";

const BASE_URL = "http://localhost:3001/api";

// API endpoint constants
export const API_ENDPOINTS = {
  SESSIONS: `${BASE_URL}/sessions`,
  EXERCISES: `${BASE_URL}/exercises`,
  SEGMENTS: `${BASE_URL}/segments`,
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
