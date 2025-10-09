import { useMemo } from "react";
import { useExercises, useSessions } from "../utils/api";
import { useSegmentContext } from "../hooks/useSegmentContext";
import { formatTimeOfDay } from "../utils";

const TodaysSessions = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const { selectedSegment } = useSegmentContext();

  const todaysSessions = useMemo(() => {
    if (!sessions || !exercises) return [];

    const today = new Date().toISOString().split("T")[0];

    return sessions
      .filter((session) => {
        const sessionDate = session.date.split("T")[0];
        return sessionDate === today;
      })
      .map((session) => {
        const exercise = exercises.find((e) => e.id === session.exercise);
        return {
          ...session,
          exerciseName: exercise?.name || "Unknown Exercise",
        };
      })
      .reverse(); // Show most recent first
  }, [sessions, exercises]);

  // Calculate segment completion for today
  const segmentCompletion = useMemo(() => {
    if (!selectedSegment || !exercises || !todaysSessions.length) {
      return { completed: false, practiced: 0, total: 0 };
    }

    // Get exercises for the selected segment
    const segmentExercises = exercises.filter(
      (ex) => ex.segmentId === selectedSegment.id
    );

    // Get unique exercises practiced today in this segment
    const practicedExerciseIds = new Set(
      todaysSessions
        .map((s) => s.exercise)
        .filter((exId) => {
          const ex = exercises.find((e) => e.id === exId);
          return ex && ex.segmentId === selectedSegment.id;
        })
    );

    return {
      completed: practicedExerciseIds.size >= segmentExercises.length,
      practiced: practicedExerciseIds.size,
      total: segmentExercises.length,
    };
  }, [selectedSegment, exercises, todaysSessions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!sessions || !exercises) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Today's Sessions</h2>
        {selectedSegment && segmentCompletion.total > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {segmentCompletion.practiced}/{segmentCompletion.total} exercises
            </span>
            {segmentCompletion.completed && (
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/50 flex items-center gap-1">
                ✓ All Complete!
              </span>
            )}
          </div>
        )}
      </div>

      {todaysSessions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No sessions logged today yet. Start practicing!
        </p>
      ) : (
        <div className="space-y-3">
          {todaysSessions.map((session) => (
            <div
              key={session.id}
              className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">
                  {session.exerciseName}
                </h3>
                <span className="text-xs text-gray-400">
                  {formatTimeOfDay(session.date)}
                </span>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">BPM:</span>
                  <span className="text-white font-semibold">
                    {session.bpm}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white font-semibold">
                    {formatTime(session.time)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-600/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Sessions:</span>
              <span className="text-white font-semibold">
                {todaysSessions.length}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Total Time:</span>
              <span className="text-white font-semibold">
                {formatTime(todaysSessions.reduce((acc, s) => acc + s.time, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysSessions;
