import { useMemo } from "react";
import { useExercises, useSessions } from "../../utils/api";
import { StatCard } from "../StatCard";

const HighestBpm = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const maxBpm = useMemo(() => {
    if (!sessions) return null;
    if (!sessions.length) return null;
    return sessions.reduce((max, session) => {
      return session.bpm > max.bpm ? session : max;
    }, sessions[0]);
  }, [sessions]);

  const lowestBpmByExercise = (exerciseId: string | undefined) => {
    if (!exerciseId) return null;
    if (!sessions) return null;
    return sessions
      .filter((s) => s.exercise === exerciseId)
      .reduce((min, s) => {
        return s.bpm < min.bpm ? s : min;
      }, sessions[0]);
  };

  if (!sessions || !exercises) return null;

  const footer = `On ${
    exercises.find((e) => e.id === maxBpm?.exercise)?.name
  } from ${lowestBpmByExercise(maxBpm?.exercise)?.bpm.toString()} BPM`;

  return (
    <StatCard
      title="Highest BPM"
      value={maxBpm?.bpm.toString() || "0"}
      footer={footer}
    />
  );
};

export default HighestBpm;
