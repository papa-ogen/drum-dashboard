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

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <SessionLogger />
        </div>
        <div>
          <TodaysSessions />
        </div>
        <div>
          <Metronome />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
