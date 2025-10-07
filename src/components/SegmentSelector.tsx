import { useSegmentContext } from "../hooks/useSegmentContext";

const SegmentSelector = () => {
  const { selectedSegment, setSelectedSegment, allSegments, isLoading } =
    useSegmentContext();

  if (isLoading || !allSegments) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <span className="text-gray-400 text-sm font-medium flex items-center mr-2">
        Training Period:
      </span>
      {allSegments
        .sort((a, b) => a.order - b.order)
        .map((segment) => {
          const isSelected = selectedSegment?.id === segment.id;
          const startDate = segment.startDate
            ? new Date(segment.startDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "";

          return (
            <button
              key={segment.id}
              onClick={() => setSelectedSegment(segment)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">{segment.name}</span>
                {startDate && (
                  <span className="text-xs opacity-80">{startDate}</span>
                )}
              </div>
            </button>
          );
        })}
    </div>
  );
};

export default SegmentSelector;
