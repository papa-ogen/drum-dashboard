import {
  Achievements,
  AllExercisesBpmChart,
  ExerciseTimeline,
  MonthByMonthChart,
  PracticeHeatmap,
  SegmentComparisonChart,
  SessionsOverTimeChart,
  TimeDistributionChart,
  YearProgressBar,
  YearStats,
} from "../components/Summary";

const Summary = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Year Summary</h1>
        <p className="text-gray-400">
          Complete overview of your drum training journey
        </p>
      </div>

      {/* Overall Year Progress */}
      <YearProgressBar />

      {/* Key Year Statistics */}
      <YearStats />

      {/* Month-by-Month Analysis */}
      <MonthByMonthChart />

      {/* Segment Comparison */}
      <SegmentComparisonChart />

      {/* All Exercises Timeline */}
      <ExerciseTimeline />

      {/* BPM Progress Across All Exercises */}
      <AllExercisesBpmChart />

      {/* Achievements */}
      <Achievements />

      {/* Practice Calendar Heatmap */}
      <PracticeHeatmap />

      {/* Exercise Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TimeDistributionChart />

        <SessionsOverTimeChart />
      </div>
    </div>
  );
};

export default Summary;
