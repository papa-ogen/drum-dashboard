import { useMemo } from "react";
import { useExercises, useSessions, useSegments } from "../../utils/api";

const ExerciseTimeline = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const { segments } = useSegments();

  const timelineData = useMemo(() => {
    if (!sessions || !exercises || !segments) return [];

    const sortedSegments = [...segments].sort((a, b) => a.order - b.order);

    return sortedSegments.map((segment) => {
      const segmentExercises = exercises
        .filter((ex) => ex.segmentId === segment.id)
        .map((exercise) => {
          const exerciseSessions = sessions.filter(
            (s) => s.exercise === exercise.id
          );

          const totalSessions = exerciseSessions.length;
          const totalTime = exerciseSessions.reduce(
            (acc, s) => acc + s.time,
            0
          );

          // Calculate BPM progress
          const sortedSessions = [...exerciseSessions].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          const firstBpm = sortedSessions[0]?.bpm || 0;
          const lastBpm =
            sortedSessions[sortedSessions.length - 1]?.bpm || firstBpm;
          const bpmGrowth = lastBpm - firstBpm;

          return {
            id: exercise.id,
            name: exercise.name,
            totalSessions,
            totalTime,
            firstBpm,
            lastBpm,
            bpmGrowth,
            hasData: totalSessions > 0,
          };
        });

      return {
        segment,
        exercises: segmentExercises,
      };
    });
  }, [sessions, exercises, segments]);

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0m";
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  if (!sessions || !exercises || !segments) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Exercise Progress Timeline
      </h2>

      <div className="space-y-6">
        {timelineData.map(({ segment, exercises: segmentExercises }) => (
          <div key={segment.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                <h3 className="text-lg font-semibold text-white">
                  {segment.name}
                </h3>
              </div>
              {segment.startDate && segment.endDate && (
                <span className="text-xs text-gray-500">
                  {new Date(segment.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(segment.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 ml-4">
              {segmentExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    exercise.hasData
                      ? "bg-gray-700/50 border-indigo-500/30 hover:border-indigo-500 hover:shadow-lg"
                      : "bg-gray-700/20 border-gray-600/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4
                      className={`font-medium text-sm ${
                        exercise.hasData ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {exercise.name}
                    </h4>
                    {exercise.hasData && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>

                  {exercise.hasData ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Sessions:</span>
                        <span className="text-sm font-semibold text-white">
                          {exercise.totalSessions}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Time:</span>
                        <span className="text-sm font-semibold text-white">
                          {formatTime(exercise.totalTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">BPM:</span>
                        <span className="text-sm font-semibold text-white">
                          {exercise.firstBpm} → {exercise.lastBpm}
                        </span>
                      </div>
                      {exercise.bpmGrowth > 0 && (
                        <div className="flex justify-between items-center pt-1 border-t border-gray-600">
                          <span className="text-xs text-gray-400">Growth:</span>
                          <span className="text-sm font-semibold text-green-400">
                            +{exercise.bpmGrowth} BPM
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-3">
                      No sessions logged
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseTimeline;
