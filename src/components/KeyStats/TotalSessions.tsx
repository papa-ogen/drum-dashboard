import { useMemo } from "react";
import { useExercises, useSessions } from "../../utils/api";
import { useSegmentContext } from "../../hooks/useSegmentContext";
import { StatCard } from "../StatCard";
import { countUniquePracticeDays } from "../../utils";

const TotalSessions = () => {
  const { selectedSegment } = useSegmentContext();
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const totalPracticeDays = useMemo(() => {
    if (!sessions || !exercises) return 0;

    const filteredSessions = selectedSegment
      ? sessions.filter((s) => {
          const exercise = exercises.find((ex) => ex.id === s.exercise);
          return exercise && exercise.segmentId === selectedSegment.id;
        })
      : sessions;

    return countUniquePracticeDays(filteredSessions);
  }, [sessions, exercises, selectedSegment]);

  if (!sessions || !exercises) return null;

  return (
    <StatCard title="Practice Days" value={totalPracticeDays.toString()} />
  );
};

export default TotalSessions;
