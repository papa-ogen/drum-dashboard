import {
  MetronomeButton,
  SegmentProgress,
  SegmentSelector,
  SessionLogger,
  SongSuggestions,
  TodaysSessions,
  WarmupList,
} from "../components";
import { MonthComparison } from "../components/Summary";

const Dashboard = () => {
  return (
    <>
      <SegmentSelector />
      <SegmentProgress />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <SessionLogger />
        </div>
        <div className="space-y-4">
          <TodaysSessions />
          <MonthComparison />
        </div>
        <div className="space-y-4">
          <MetronomeButton />
          <WarmupList />
        </div>
      </main>

      {/* Song Suggestions Section */}
      <div className="mt-6">
        <SongSuggestions />
      </div>
    </>
  );
};

export default Dashboard;
