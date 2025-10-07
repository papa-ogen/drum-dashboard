import { useMemo } from "react";
import { useExercises, useSessions } from "../../utils/api";
import { useSegmentContext } from "../../hooks/useSegmentContext";
import { StatCard } from "../StatCard";

const HighestDiff = () => {
  const { selectedSegment } = useSegmentContext();
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const highestDiff = useMemo(() => {
    if (!sessions || !exercises) return null;
    if (!sessions.length) return null;

    const filteredSessions = selectedSegment
      ? sessions.filter((s) => {
          const exercise = exercises.find((ex) => ex.id === s.exercise);
          return exercise && exercise.segmentId === selectedSegment.id;
        })
      : sessions;

    if (!filteredSessions.length) return null;

    // Group sessions by exercise and calculate BPM difference for each
    const exerciseDiffs = new Map<
      string,
      { min: number; max: number; diff: number; name: string }
    >();

    filteredSessions.forEach((session) => {
      const existing = exerciseDiffs.get(session.exercise);
      const exerciseName =
        exercises.find((e) => e.id === session.exercise)?.name || "Unknown";

      if (existing) {
        exerciseDiffs.set(session.exercise, {
          min: Math.min(existing.min, session.bpm),
          max: Math.max(existing.max, session.bpm),
          diff:
            Math.max(existing.max, session.bpm) -
            Math.min(existing.min, session.bpm),
          name: exerciseName,
        });
      } else {
        exerciseDiffs.set(session.exercise, {
          min: session.bpm,
          max: session.bpm,
          diff: 0,
          name: exerciseName,
        });
      }
    });

    // Find the exercise with the highest difference
    let maxDiff = { diff: 0, name: "", exerciseId: "" };
    exerciseDiffs.forEach((value, key) => {
      if (value.diff > maxDiff.diff) {
        maxDiff = { diff: value.diff, name: value.name, exerciseId: key };
      }
    });

    return maxDiff.diff > 0 ? maxDiff : null;
  }, [sessions, exercises, selectedSegment]);

  if (!sessions || !exercises) return null;

  return (
    <StatCard
      title="Highest BPM Increase"
      value={highestDiff ? `${highestDiff.diff} BPM` : "0"}
      footer={highestDiff?.name}
    />
  );
};

export default HighestDiff;
