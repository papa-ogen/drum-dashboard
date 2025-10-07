import PracticeHeatmap from "../components/Summary/PracticeHeatmap";

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
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Year Progress</h2>
        <div className="h-8 bg-gray-700 rounded-full animate-pulse" />
        <p className="text-sm text-gray-500 mt-2">
          Component: YearProgressBar (shows overall year completion)
        </p>
      </div>

      {/* Key Year Statistics */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Year Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Total Practice Time",
            "Total Sessions",
            "Exercises Completed",
            "Avg BPM Growth",
          ].map((stat) => (
            <div
              key={stat}
              className="bg-gray-700/50 p-4 rounded-lg animate-pulse"
            >
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />
              <div className="h-8 bg-gray-600 rounded w-1/2" />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Component: YearStats (aggregate stats across all segments)
        </p>
      </div>

      {/* Segment Comparison */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Segment Comparison
        </h2>
        <div className="h-64 bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Bar Chart Comparing Segments</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Component: SegmentComparisonChart (compare time/sessions/progress
          across 3 segments)
        </p>
      </div>

      {/* All Exercises Timeline */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Exercise Progress Timeline
        </h2>
        <div className="space-y-4">
          {["Segment 1", "Segment 2", "Segment 3"].map((segment) => (
            <div key={segment}>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                {segment}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-700 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Component: ExerciseTimeline (show all exercises by segment with
          progress)
        </p>
      </div>

      {/* BPM Progress Across All Exercises */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          BPM Progress (All Exercises)
        </h2>
        <div className="h-80 bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Line Chart with All Exercises</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Component: AllExercisesBpmChart (multi-line chart showing BPM over
          time)
        </p>
      </div>

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
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Time Distribution
          </h2>
          <div className="h-64 bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Pie Chart</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Component: TimeDistributionChart (pie/donut chart)
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Sessions by Week
          </h2>
          <div className="h-64 bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Area Chart</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Component: SessionsOverTimeChart (area chart showing weekly
            sessions)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
