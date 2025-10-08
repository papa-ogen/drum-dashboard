import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSessions } from "../../utils/api";

const TimeDistributionChart = () => {
  const { sessions } = useSessions();

  const chartData = useMemo(() => {
    if (!sessions) return [];

    // Group sessions by hour of day (using UTC to match stored time)
    const hourMap: Record<number, number> = {};

    sessions.forEach((session) => {
      const date = new Date(session.date);
      const hour = date.getUTCHours(); // Use UTC hours to match the stored timestamp
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });

    const formatHour = (hour: number): string => {
      if (hour === 0) return "12 AM";
      if (hour === 12) return "12 PM";
      if (hour < 12) return `${hour} AM`;
      return `${hour - 12} PM`;
    };

    // Create data for all 24 hours
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sessions: hourMap[hour] || 0,
      label: formatHour(hour),
    }));
  }, [sessions]);

  const getPeakHours = () => {
    const maxSessions = Math.max(...chartData.map((d) => d.sessions));
    const peakHours = chartData
      .filter((d) => d.sessions === maxSessions && d.sessions > 0)
      .map((d) => d.label);
    return peakHours;
  };

  const totalSessions = chartData.reduce((acc, d) => acc + d.sessions, 0);

  if (!sessions) return null;

  const peakHours = getPeakHours();

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Practice Time of Day
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis
              dataKey="label"
              stroke="#A0AEC0"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={1}
            />
            <YAxis
              stroke="#A0AEC0"
              fontSize={12}
              label={{
                value: "Sessions",
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
              formatter={(value: number) => [value, "Sessions"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar dataKey="sessions" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-700/30 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">Total Sessions</div>
          <div className="text-xl font-bold text-white">{totalSessions}</div>
        </div>
        <div className="bg-gray-700/30 p-3 rounded-lg text-center">
          <div className="text-xs text-gray-400 mb-1">Peak Practice Time</div>
          <div className="text-lg font-bold text-white">
            {peakHours.length > 0 ? peakHours.join(", ") : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDistributionChart;
