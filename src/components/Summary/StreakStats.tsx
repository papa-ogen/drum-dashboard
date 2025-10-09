import { useMemo } from "react";
import { useSessions } from "../../utils/api";

const StreakStats = () => {
  const { sessions } = useSessions();

  const streakData = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastPracticeDate: null,
      };
    }

    // Get unique dates sorted
    const uniqueDates = Array.from(
      new Set(sessions.map((s) => s.date.split("T")[0]))
    ).sort();

    // Calculate longest streak
    let currentStreak = 1;
    let longestStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    // Calculate current active streak
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const lastPracticeDate = uniqueDates[uniqueDates.length - 1];

    let activeStreak = 0;
    if (lastPracticeDate === today || lastPracticeDate === yesterday) {
      // Work backwards from most recent date to find active streak
      activeStreak = 1;
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const prevDate = new Date(uniqueDates[i]);
        const currDate = new Date(uniqueDates[i + 1]);
        const diffDays = Math.floor(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          activeStreak++;
        } else {
          break;
        }
      }
    }

    return {
      currentStreak: activeStreak,
      longestStreak,
      lastPracticeDate,
    };
  }, [sessions]);

  if (!sessions) return null;

  const isStreakActive = streakData.currentStreak > 0;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Practice Streaks 🔥
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Streak */}
        <div
          className={`p-4 rounded-lg border ${
            isStreakActive
              ? "bg-gradient-to-br from-orange-900/40 to-gray-800/80 border-orange-500"
              : "bg-gray-700/30 border-gray-600/50"
          }`}
        >
          <div className="text-xs text-gray-400 mb-1">Current Streak</div>
          <div className="flex items-baseline gap-2">
            <div
              className={`text-4xl font-bold ${
                isStreakActive ? "text-orange-400" : "text-gray-500"
              }`}
            >
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-gray-400">
              {streakData.currentStreak === 1 ? "day" : "days"}
            </div>
          </div>
          {!isStreakActive && (
            <p className="text-xs text-gray-500 mt-2">
              Practice today to start a new streak!
            </p>
          )}
        </div>

        {/* Longest Streak */}
        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/50">
          <div className="text-xs text-gray-400 mb-1">Longest Streak</div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-indigo-400">
              {streakData.longestStreak}
            </div>
            <div className="text-sm text-gray-400">
              {streakData.longestStreak === 1 ? "day" : "days"}
            </div>
          </div>
          {streakData.longestStreak >= 7 && (
            <p className="text-xs text-green-400 mt-2">
              🏆 Week+ streak achieved!
            </p>
          )}
        </div>
      </div>

      {/* Last Practice */}
      {streakData.lastPracticeDate && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Last practiced:{" "}
          <span className="text-white">
            {new Date(streakData.lastPracticeDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakStats;
