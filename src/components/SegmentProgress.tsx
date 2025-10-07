import { useSegmentContext } from "../hooks/useSegmentContext";

const SegmentProgress = () => {
  const { selectedSegment, allSegments } = useSegmentContext();

  const calculateSegmentProgress = () => {
    if (selectedSegment?.startDate && selectedSegment?.endDate) {
      const start = new Date(selectedSegment.startDate).getTime();
      const end = new Date(selectedSegment.endDate).getTime();
      const now = new Date().getTime();

      if (now < start) return 0;
      if (now > end) return 100;

      return ((now - start) / (end - start)) * 100;
    }
    return 0;
  };

  const calculateOverallProgress = () => {
    if (!allSegments || allSegments.length === 0) return 0;

    const firstSegment = allSegments[0];
    const lastSegment = allSegments[allSegments.length - 1];

    if (!firstSegment.startDate || !lastSegment.endDate) return 0;

    const start = new Date(firstSegment.startDate).getTime();
    const end = new Date(lastSegment.endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;

    return ((now - start) / (end - start)) * 100;
  };

  const getDaysRemaining = (endDate: string | undefined) => {
    if (!endDate) return null;

    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 33) return "bg-green-500";
    if (progress < 66) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const segmentProgress = calculateSegmentProgress();
  const overallProgress = calculateOverallProgress();
  const lastSegment = allSegments?.[allSegments.length - 1];

  return (
    <div className="mb-8 space-y-4">
      {/* Segment Progress */}
      {selectedSegment && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">
              {selectedSegment.name} Progress
            </span>
            <div className="flex items-center gap-3">
              {selectedSegment.endDate && (
                <span className="text-sm text-gray-400">
                  {getDaysRemaining(selectedSegment.endDate)} days remaining
                </span>
              )}
              <span className="text-sm font-semibold text-white">
                {Math.round(segmentProgress)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${getProgressColor(
                segmentProgress
              )}`}
              style={{ width: `${segmentProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Overall Year Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">
            Overall Year Progress
          </span>
          <div className="flex items-center gap-3">
            {lastSegment?.endDate && (
              <span className="text-sm text-gray-400">
                {getDaysRemaining(lastSegment.endDate)} days remaining
              </span>
            )}
            <span className="text-sm font-semibold text-white">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SegmentProgress;
