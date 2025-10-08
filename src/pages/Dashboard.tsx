import {
  Metronome,
  SegmentProgress,
  SegmentSelector,
  SessionLogger,
  TodaysSessions,
} from "../components";

const Dashboard = () => {
  return (
    <>
      <SegmentSelector />
      <SegmentProgress />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          <SessionLogger />
          <Metronome />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          <TodaysSessions />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
