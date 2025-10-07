import { useMemo } from "react";
import { useExercises, useSessions } from "../../utils/api";
import { useSegmentContext } from "../../hooks/useSegmentContext";
import { StatCard } from "../StatCard";

const TotalSessions = () => {
  const { selectedSegment } = useSegmentContext();
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const filteredStats = useMemo(() => {
    if (!sessions || !exercises) return { sessions: 0, exercises: 0 };

    const filteredExercises = selectedSegment
      ? exercises.filter((ex) => ex.segmentId === selectedSegment.id)
      : exercises;

    const filteredSessions = selectedSegment
      ? sessions.filter((s) => {
          const exercise = exercises.find((ex) => ex.id === s.exercise);
          return exercise && exercise.segmentId === selectedSegment.id;
        })
      : sessions;

    return {
      sessions: filteredSessions.length,
      exercises: filteredExercises.length,
    };
  }, [sessions, exercises, selectedSegment]);

  if (!sessions || !exercises) return null;

  return (
    <StatCard
      title="Total Sessions"
      value={
        filteredStats.exercises > 0
          ? Math.round(
              filteredStats.sessions / filteredStats.exercises
            ).toString()
          : "0"
      }
    />
  );
};

export default TotalSessions;
