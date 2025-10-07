import { useMemo } from "react";
import { useExercises, useSessions } from "../../utils/api";

const YearStats = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const stats = useMemo(() => {
    if (!sessions || !exercises) {
      return {
        totalPracticeTime: "0h",
        totalSessions: 0,
        exercisesCompleted: 0,
        avgBpmGrowth: 0,
      };
    }

    // Total practice time
    const totalSeconds = sessions.reduce((acc, s) => acc + s.time, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const totalPracticeTime =
      hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Exercises completed (exercises that have at least one session)
    const exercisesWithSessions = new Set(sessions.map((s) => s.exercise));
    const exercisesCompleted = exercisesWithSessions.size;

    // Total sessions (average sessions per exercise)
    const totalSessions =
      exercisesCompleted > 0
        ? Math.round(sessions.length / exercisesCompleted)
        : 0;

    // Average BPM growth across all exercises
    const exerciseGrowth: number[] = [];
    exercises.forEach((exercise) => {
      const exerciseSessions = sessions
        .filter((s) => s.exercise === exercise.id)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      if (exerciseSessions.length >= 2) {
        const firstBpm = exerciseSessions[0].bpm;
        const lastBpm = exerciseSessions[exerciseSessions.length - 1].bpm;
        const growth = lastBpm - firstBpm;
        if (growth > 0) {
          exerciseGrowth.push(growth);
        }
      }
    });

    const avgBpmGrowth =
      exerciseGrowth.length > 0
        ? Math.round(
            exerciseGrowth.reduce((a, b) => a + b, 0) / exerciseGrowth.length
          )
        : 0;

    return {
      totalPracticeTime,
      totalSessions,
      exercisesCompleted,
      avgBpmGrowth,
    };
  }, [sessions, exercises]);

  if (!sessions || !exercises) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Year Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Practice Time */}
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 hover:border-indigo-500/50 transition-colors">
          <div className="text-sm text-gray-400 mb-1">Total Practice Time</div>
          <div className="text-3xl font-bold text-white">
            {stats.totalPracticeTime}
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 hover:border-indigo-500/50 transition-colors">
          <div className="text-sm text-gray-400 mb-1">
            Avg Sessions/Exercise
          </div>
          <div className="text-3xl font-bold text-white">
            {stats.totalSessions}
          </div>
        </div>

        {/* Exercises Completed */}
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 hover:border-indigo-500/50 transition-colors">
          <div className="text-sm text-gray-400 mb-1">Exercises Completed</div>
          <div className="text-3xl font-bold text-white">
            {stats.exercisesCompleted}
            <span className="text-lg text-gray-400">/{exercises.length}</span>
          </div>
        </div>

        {/* Avg BPM Growth */}
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50 hover:border-indigo-500/50 transition-colors">
          <div className="text-sm text-gray-400 mb-1">Avg BPM Growth</div>
          <div className="text-3xl font-bold text-green-400">
            +{stats.avgBpmGrowth}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearStats;
