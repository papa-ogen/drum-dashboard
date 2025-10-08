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
import { countUniquePracticeDays } from "../../utils";

const MonthByMonthChart = () => {
  const { sessions } = useSessions();

  const monthlyData = useMemo(() => {
    if (!sessions) return [];

    // Get date range from first session to now
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedSessions.length === 0) return [];

    const firstDate = new Date(sortedSessions[0].date);
    const now = new Date();

    // Generate all months from first session to now
    const months: Array<{
      month: string;
      year: number;
      monthIndex: number;
      sessions: typeof sortedSessions;
    }> = [];

    const currentDate = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      1
    );
    const endDate = new Date(now.getFullYear(), now.getMonth(), 1);

    while (currentDate <= endDate) {
      months.push({
        month: currentDate.toLocaleDateString("en-US", { month: "short" }),
        year: currentDate.getFullYear(),
        monthIndex: currentDate.getMonth(),
        sessions: [],
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Group sessions by month
    sortedSessions.forEach((session) => {
      const date = new Date(session.date);
      const monthData = months.find(
        (m) => m.monthIndex === date.getMonth() && m.year === date.getFullYear()
      );
      if (monthData) {
        monthData.sessions.push(session);
      }
    });

    // Calculate stats for each month
    return months.map((monthData) => {
      const practiceDays = countUniquePracticeDays(monthData.sessions);
      const totalTime = monthData.sessions.reduce((acc, s) => acc + s.time, 0);
      const avgBpm =
        monthData.sessions.length > 0
          ? Math.round(
              monthData.sessions.reduce((acc, s) => acc + s.bpm, 0) /
                monthData.sessions.length
            )
          : 0;

      return {
        label: `${monthData.month} ${monthData.year}`,
        shortLabel: monthData.month,
        practiceDays,
        totalSessions: monthData.sessions.length,
        totalHours: parseFloat((totalTime / 3600).toFixed(1)),
        avgBpm,
      };
    });
  }, [sessions]);

  if (!sessions || monthlyData.length === 0) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Month-by-Month Progress
      </h2>

      {/* Practice Days Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis
              dataKey="shortLabel"
              stroke="#A0AEC0"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#A0AEC0" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "1px solid #4A5568",
                borderRadius: "0.5rem",
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.label;
                }
                return label;
              }}
            />
            <Bar
              dataKey="practiceDays"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Practice Days"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left text-gray-400 font-medium py-2">
                Month
              </th>
              <th className="text-right text-gray-400 font-medium py-2">
                Practice Days
              </th>
              <th className="text-right text-gray-400 font-medium py-2">
                Sessions
              </th>
              <th className="text-right text-gray-400 font-medium py-2">
                Hours
              </th>
              <th className="text-right text-gray-400 font-medium py-2">
                Avg BPM
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((month, index) => (
              <tr
                key={month.label}
                className={`border-b border-gray-700/50 ${
                  index === monthlyData.length - 1
                    ? "bg-indigo-900/20"
                    : "hover:bg-gray-700/30"
                }`}
              >
                <td className="py-2 text-white">{month.label}</td>
                <td className="py-2 text-right text-white">
                  {month.practiceDays}
                </td>
                <td className="py-2 text-right text-white">
                  {month.totalSessions}
                </td>
                <td className="py-2 text-right text-white">
                  {month.totalHours}h
                </td>
                <td className="py-2 text-right text-white">{month.avgBpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthByMonthChart;
