import useSWR from "swr";
import { fetcher } from "./fetcher";
import type { ISession, IExercise } from "../type";

const BASE_URL = "http://localhost:3001/api";

export function useSessions(): {
  sessions: ISession[] | undefined;
  isLoading: boolean;
  isError: Error | undefined;
} {
  const { data, error, isLoading } = useSWR<ISession[]>(
    `${BASE_URL}/sessions`,
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
    `${BASE_URL}/exercises`,
    fetcher
  );

  return {
    exercises: data,
    isLoading,
    isError: error,
  };
}
