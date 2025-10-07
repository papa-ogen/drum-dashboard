import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useExercises, useSessions } from "../../utils/api";

const TimeDistributionChart = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const chartData = useMemo(() => {
    if (!sessions || !exercises) return [];

    // Calculate total time per exercise
    const timeMap = sessions.reduce((acc, session) => {
      const { exercise: exerciseId, time } = session;
      acc[exerciseId] = (acc[exerciseId] || 0) + time;
      return acc;
    }, {} as Record<string, number>);

    // Create chart data with percentages
    const totalTime = Object.values(timeMap).reduce((a, b) => a + b, 0);

    return exercises
      .map((exercise) => {
        const time = timeMap[exercise.id] || 0;
        const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;

        return {
          name: exercise.name,
          value: Math.round(time / 60), // Convert to minutes
          percentage: percentage.toFixed(1),
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [sessions, exercises]);

  const colors = [
    "#6366F1", // Indigo
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#14b8a6", // Teal
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#a855f7", // Violet
    "#f43f5e", // Rose
  ];

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  if (!sessions || !exercises || chartData.length === 0) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Time Distribution
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "1px solid #4A5568",
                borderRadius: "0.5rem",
              }}
              formatter={(value: number) => [formatTime(value), "Time"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => {
                const item = chartData.find((d) => d.name === value);
                return `${value} (${item?.percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stats List */}
      <div className="mt-6 space-y-2">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">
                {formatTime(item.value)}
              </span>
              <span className="text-xs text-gray-400 w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeDistributionChart;
