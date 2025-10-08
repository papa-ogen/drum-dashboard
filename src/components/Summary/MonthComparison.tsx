import { useMemo } from "react";
import { useSessions } from "../../utils/api";
import { countUniquePracticeDays } from "../../utils";

const MonthComparison = () => {
  const { sessions } = useSessions();

  const monthStats = useMemo(() => {
    if (!sessions) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter sessions for current month
    const currentMonthSessions = sessions.filter((session) => {
      const date = new Date(session.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    // Filter sessions for last month
    const lastMonthSessions = sessions.filter((session) => {
      const date = new Date(session.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

    // Calculate stats for current month
    const currentPracticeDays = countUniquePracticeDays(currentMonthSessions);
    const currentTotalTime = currentMonthSessions.reduce(
      (acc, s) => acc + s.time,
      0
    );
    const currentAvgBpm =
      currentMonthSessions.length > 0
        ? Math.round(
            currentMonthSessions.reduce((acc, s) => acc + s.bpm, 0) /
              currentMonthSessions.length
          )
        : 0;

    // Calculate stats for last month
    const lastPracticeDays = countUniquePracticeDays(lastMonthSessions);
    const lastTotalTime = lastMonthSessions.reduce((acc, s) => acc + s.time, 0);
    const lastAvgBpm =
      lastMonthSessions.length > 0
        ? Math.round(
            lastMonthSessions.reduce((acc, s) => acc + s.bpm, 0) /
              lastMonthSessions.length
          )
        : 0;

    return {
      current: {
        month: now.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        practiceDays: currentPracticeDays,
        totalTime: currentTotalTime,
        avgBpm: currentAvgBpm,
        sessions: currentMonthSessions.length,
      },
      last: {
        month: new Date(lastMonthYear, lastMonth).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        practiceDays: lastPracticeDays,
        totalTime: lastTotalTime,
        avgBpm: lastAvgBpm,
        sessions: lastMonthSessions.length,
      },
    };
  }, [sessions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getChangeIndicator = (current: number, last: number) => {
    if (last === 0 && current === 0)
      return { text: "-", color: "text-gray-400" };
    if (last === 0) return { text: "New!", color: "text-green-400" };

    const diff = current - last;
    const percentChange = Math.round((diff / last) * 100);

    if (diff > 0) {
      return {
        text: `+${percentChange}%`,
        color: "text-green-400",
      };
    } else if (diff < 0) {
      return {
        text: `${percentChange}%`,
        color: "text-red-400",
      };
    }
    return {
      text: "0%",
      color: "text-gray-400",
    };
  };

  if (!sessions || !monthStats) return null;

  const { current, last } = monthStats;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Monthly Comparison
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Last Month */}
        <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            {last.month}
          </h3>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-400">Practice Days</div>
              <div className="text-2xl font-bold text-white">
                {last.practiceDays}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Total Sessions</div>
              <div className="text-2xl font-bold text-white">
                {last.sessions}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Total Time</div>
              <div className="text-2xl font-bold text-white">
                {formatTime(last.totalTime)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Avg BPM</div>
              <div className="text-2xl font-bold text-white">{last.avgBpm}</div>
            </div>
          </div>
        </div>

        {/* Current Month */}
        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/50">
          <h3 className="text-sm font-semibold text-indigo-400 mb-3">
            {current.month}
          </h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-gray-400">Practice Days</div>
                <div className="text-2xl font-bold text-white">
                  {current.practiceDays}
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  getChangeIndicator(current.practiceDays, last.practiceDays)
                    .color
                }`}
              >
                {
                  getChangeIndicator(current.practiceDays, last.practiceDays)
                    .text
                }
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-gray-400">Total Sessions</div>
                <div className="text-2xl font-bold text-white">
                  {current.sessions}
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  getChangeIndicator(current.sessions, last.sessions).color
                }`}
              >
                {getChangeIndicator(current.sessions, last.sessions).text}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-gray-400">Total Time</div>
                <div className="text-2xl font-bold text-white">
                  {formatTime(current.totalTime)}
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  getChangeIndicator(current.totalTime, last.totalTime).color
                }`}
              >
                {getChangeIndicator(current.totalTime, last.totalTime).text}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-gray-400">Avg BPM</div>
                <div className="text-2xl font-bold text-white">
                  {current.avgBpm}
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  getChangeIndicator(current.avgBpm, last.avgBpm).color
                }`}
              >
                {getChangeIndicator(current.avgBpm, last.avgBpm).text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthComparison;
