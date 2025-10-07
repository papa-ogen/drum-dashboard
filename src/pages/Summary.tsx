import {
  AllExercisesBpmChart,
  ExerciseTimeline,
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

      {/* Segment Comparison */}
      <SegmentComparisonChart />

      {/* All Exercises Timeline */}
      <ExerciseTimeline />

      {/* BPM Progress Across All Exercises */}
      <AllExercisesBpmChart />

      {/* Milestones & Achievements */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Milestones & Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Highest BPM Achieved",
            "Biggest BPM Jump",
            "Most Practiced Exercise",
            "Longest Session",
            "Most Consistent Week",
            "Best Improvement",
          ].map((milestone) => (
            <div
              key={milestone}
              className="bg-gray-700/50 p-4 rounded-lg border-2 border-gray-600"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-600 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Component: Milestones (highlight key achievements throughout the year)
        </p>
      </div>

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
