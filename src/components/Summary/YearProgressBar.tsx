import { useMemo } from "react";
import { useSegments } from "../../utils/api";

const YearProgressBar = () => {
  const { segments } = useSegments();

  const { progress, daysRemaining, daysElapsed, totalDays } = useMemo(() => {
    if (!segments || segments.length === 0) {
      return { progress: 0, daysRemaining: null, daysElapsed: 0, totalDays: 0 };
    }

    const sortedSegments = [...segments].sort((a, b) => a.order - b.order);
    const firstSegment = sortedSegments[0];
    const lastSegment = sortedSegments[sortedSegments.length - 1];

    if (!firstSegment.startDate || !lastSegment.endDate) {
      return { progress: 0, daysRemaining: null, daysElapsed: 0, totalDays: 0 };
    }

    const start = new Date(firstSegment.startDate).getTime();
    const end = new Date(lastSegment.endDate).getTime();
    const now = new Date().getTime();

    const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const elapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    const remaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    let progressPercent = 0;
    if (now < start) {
      progressPercent = 0;
    } else if (now > end) {
      progressPercent = 100;
    } else {
      progressPercent = ((now - start) / (end - start)) * 100;
    }

    return {
      progress: progressPercent,
      daysRemaining: remaining > 0 ? remaining : 0,
      daysElapsed: elapsed > 0 ? elapsed : 0,
      totalDays: total,
    };
  }, [segments]);

  const getProgressColor = () => {
    if (progress < 33) return "from-green-600 to-green-400";
    if (progress < 66) return "from-yellow-600 to-yellow-400";
    return "from-orange-600 to-orange-400";
  };

  const startDate = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    const firstSegment = [...segments].sort((a, b) => a.order - b.order)[0];
    return firstSegment?.startDate
      ? new Date(firstSegment.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;
  }, [segments]);

  const endDate = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    const lastSegment = [...segments].sort((a, b) => b.order - a.order)[0];
    return lastSegment?.endDate
      ? new Date(lastSegment.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;
  }, [segments]);

  if (!segments) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Year Progress</h2>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-400">
                {startDate} - {endDate}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {daysRemaining} days remaining
              </span>
              <span className="text-lg font-bold text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out relative`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-700/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{daysElapsed}</div>
            <div className="text-xs text-gray-400 mt-1">Days Completed</div>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{daysRemaining}</div>
            <div className="text-xs text-gray-400 mt-1">Days Remaining</div>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{totalDays}</div>
            <div className="text-xs text-gray-400 mt-1">Total Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearProgressBar;
