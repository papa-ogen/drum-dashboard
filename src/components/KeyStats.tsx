import { useMemo } from "react";
import type { IExercise, ISession } from "../type";

const KeyStats = ({
  exercises,
  sessions,
}: {
  exercises: IExercise[];
  sessions: ISession[];
}) => {
  const totalPracticeTime = useMemo(() => {
    const totalSeconds = sessions.reduce((acc, s) => acc + s.time, 0);
    // if under an hour,return minutes and seconds
    if (totalSeconds < 3600) {
      return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
    }

    // return hours, minutes and seconds
    return `${Math.floor(totalSeconds / 3600)}h ${Math.floor(
      (totalSeconds % 3600) / 60
    )}m ${totalSeconds % 60}s`;
  }, [sessions]);

  const maxBpm = useMemo(() => {
    if (sessions.length === 0) return { bpm: 0, exercise: "N/A" };
    return sessions.reduce(
      (max, s) =>
        s.bpm > max.bpm ? { bpm: s.bpm, exercise: s.exercise } : max,
      { bpm: 0, exercise: "" }
    );
  }, [sessions]);

  const lowestBpmByExercise = (exerciseId: string) => {
    const exerciseSessions = sessions.filter((s) => s.exercise === exerciseId);
    if (exerciseSessions.length === 0) return 0;

    return exerciseSessions.reduce((min, s) => {
      if (min === 0) return s.bpm;
      return Math.min(min, s.bpm);
    }, 0);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Key Stats</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-baseline p-3 bg-gray-700/50 rounded-lg">
          <span className="text-gray-400">Total Practice Time</span>
          <span className="text-2xl font-bold text-white">
            {totalPracticeTime}{" "}
            <span className="text-base font-normal text-gray-400">min</span>
          </span>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-400">Highest BPM</span>
            <span className="text-2xl font-bold text-white">
              {maxBpm.bpm}{" "}
              <span className="text-base font-normal text-gray-400">
                on {exercises.find((e) => e.id === maxBpm.exercise)?.name}
              </span>
            </span>
          </div>
          <div className="flex gap-2 items-baseline">
            <span className="text-gray-400">From</span>
            <span className="text-white">
              {lowestBpmByExercise(maxBpm.exercise)}
            </span>
            <span className="text-gray-400">BPM</span>
          </div>
        </div>
        <div className="flex justify-between items-baseline p-3 bg-gray-700/50 rounded-lg">
          <span className="text-gray-400">Total Sessions</span>
          <span className="text-2xl font-bold text-white">
            {Math.round(sessions.length / exercises.length)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KeyStats;
