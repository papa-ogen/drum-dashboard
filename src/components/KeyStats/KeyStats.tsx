import TotalSessions from "./TotalSessions";
import TotalPracticeTime from "./TotalPracticeTime";
import HighestBpm from "./HighestBpm";
import HighestDiff from "./HighestDiff";

const KeyStats = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Key Stats</h2>
      <div className="space-y-4">
        <TotalPracticeTime />
        <HighestBpm />
        <HighestDiff />
        <TotalSessions />
      </div>
    </div>
  );
};

export default KeyStats;
