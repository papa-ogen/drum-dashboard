import { useMemo } from "react";
import { StatCard } from "../StatCard";
import { useExercises, useSessions } from "../../utils/api";
import { useSegmentContext } from "../../hooks/useSegmentContext";

const TotalPracticeTime = () => {
  const { selectedSegment } = useSegmentContext();
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const totalPracticeTime = useMemo(() => {
    if (!sessions || !exercises || sessions.length === 0) return "0m 0s";

    const filteredSessions = selectedSegment
      ? sessions.filter((s) => {
          const exercise = exercises.find((ex) => ex.id === s.exercise);
          return exercise && exercise.segmentId === selectedSegment.id;
        })
      : sessions;

    const totalSeconds = filteredSessions.reduce((acc, s) => acc + s.time, 0);
    // if under an hour,return minutes and seconds
    if (totalSeconds < 3600) {
      return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
    }

    // return hours, minutes and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes === 0 ? "" : `${minutes}m`} ${
      seconds === 0 ? "" : `${seconds}s`
    }`;
  }, [sessions, exercises, selectedSegment]);

  if (!sessions) return null;

  return <StatCard title="Total Practice Time" value={totalPracticeTime} />;
};

export default TotalPracticeTime;
