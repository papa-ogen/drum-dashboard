import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExercises, useSessions, useSegments } from "../../utils/api";
import { countUniquePracticeDays } from "../../utils";

const SessionsOverTimeChart = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const { segments } = useSegments();

  const chartData = useMemo(() => {
    if (!sessions || !exercises || !segments) return [];

    // Get start date from first segment
    const firstSegment = [...segments].sort((a, b) => a.order - b.order)[0];
    const startDate = firstSegment?.startDate
      ? new Date(firstSegment.startDate)
      : new Date();

    // Adjust to the Monday of the week containing startDate (week starts Monday)
    const adjustedStartDate = new Date(startDate);
    const dayOfWeek = adjustedStartDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days; otherwise go to Monday
    adjustedStartDate.setDate(adjustedStartDate.getDate() + daysToMonday);
    adjustedStartDate.setHours(0, 0, 0, 0); // Set to start of day

    const today = new Date();

    // Calculate number of weeks
    const daysDiff = Math.ceil(
      (today.getTime() - adjustedStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const numWeeks = Math.ceil(daysDiff / 7);

    // Generate data for each week
    const data = [];
    for (let week = 0; week < numWeeks; week++) {
      const weekStartDate = new Date(adjustedStartDate);
      weekStartDate.setDate(adjustedStartDate.getDate() + week * 7);

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999); // Set to end of day to include all sessions on the last day

      const weekLabel = weekStartDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Count unique days with sessions in this week
      const uniqueDaysInWeek = countUniquePracticeDays(
        sessions,
        weekStartDate,
        weekEndDate
      );

      data.push({
        week: `Week ${week + 1}`,
        weekLabel,
        sessions: uniqueDaysInWeek,
      });
    }

    return data;
  }, [sessions, exercises, segments]);

  if (!sessions || !exercises || !segments) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Practice Days per Week
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis
              dataKey="weekLabel"
              stroke="#A0AEC0"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#A0AEC0"
              fontSize={12}
              label={{
                value: "Practice Days",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#A0AEC0" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "1px solid #4A5568",
                borderRadius: "0.5rem",
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.week;
                }
                return label;
              }}
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#sessionGradient)"
              name="Practice Days"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-700/30 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">Total Weeks</div>
          <div className="text-xl font-bold text-white">{chartData.length}</div>
        </div>
        <div className="bg-gray-700/30 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">Avg Days/Week</div>
          <div className="text-xl font-bold text-white">
            {chartData.length > 0
              ? (
                  chartData.reduce((acc, w) => acc + w.sessions, 0) /
                  chartData.length
                ).toFixed(1)
              : 0}
          </div>
        </div>
        <div className="bg-gray-700/30 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">Best Week</div>
          <div className="text-xl font-bold text-white">
            {Math.max(...chartData.map((w) => w.sessions), 0)} days
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsOverTimeChart;
