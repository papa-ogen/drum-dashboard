import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExercises, useSessions } from "../../utils/api";
import { formatDate } from "../../utils";

const AllExercisesBpmChart = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();

  const chartData = useMemo(() => {
    if (!sessions || !exercises) return [];

    // Get all unique dates (date part only), sorted
    const allDates = Array.from(
      new Set(sessions.map((s) => s.date.split("T")[0]))
    ).sort();

    // Create data points for each date
    return allDates.map((date) => {
      const dataPoint: any = {
        date: formatDate(date),
        fullDate: date,
      };

      // For each exercise, get the latest BPM up to this date
      exercises.forEach((exercise) => {
        const exerciseSessionsUpToDate = sessions
          .filter(
            (s) => s.exercise === exercise.id && s.date.split("T")[0] <= date
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        if (exerciseSessionsUpToDate.length > 0) {
          dataPoint[exercise.id] = exerciseSessionsUpToDate[0].bpm;
        }
      });

      return dataPoint;
    });
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

  if (!sessions || !exercises) return null;

  // Only show exercises that have sessions
  const activeExercises = exercises.filter((ex) =>
    sessions.some((s) => s.exercise === ex.id)
  );

  if (activeExercises.length === 0) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        BPM Progress (All Exercises)
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis
              dataKey="date"
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
                value: "BPM",
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
              labelStyle={{ color: "#F3F4F6" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            {activeExercises.map((exercise, index) => (
              <Line
                key={exercise.id}
                type="monotone"
                dataKey={exercise.id}
                name={exercise.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AllExercisesBpmChart;
