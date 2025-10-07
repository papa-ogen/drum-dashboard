import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExercises, useSessions, useSegments } from "../../utils/api";

type MetricType = "time" | "sessions" | "avgBpm" | "maxBpm";

const SegmentComparisonChart = () => {
  const { sessions } = useSessions();
  const { exercises } = useExercises();
  const { segments } = useSegments();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("time");

  const chartData = useMemo(() => {
    if (!sessions || !exercises || !segments) return [];

    const sortedSegments = [...segments].sort((a, b) => a.order - b.order);

    return sortedSegments.map((segment) => {
      const segmentExercises = exercises.filter(
        (ex) => ex.segmentId === segment.id
      );
      const segmentSessions = sessions.filter((s) => {
        const exercise = exercises.find((ex) => ex.id === s.exercise);
        return exercise && exercise.segmentId === segment.id;
      });

      // Calculate metrics
      const totalTime = segmentSessions.reduce((acc, s) => acc + s.time, 0);

      // Average sessions per exercise
      const avgSessions =
        segmentExercises.length > 0
          ? Math.round(segmentSessions.length / segmentExercises.length)
          : 0;

      const avgBpm =
        segmentSessions.length > 0
          ? Math.round(
              segmentSessions.reduce((acc, s) => acc + s.bpm, 0) /
                segmentSessions.length
            )
          : 0;
      const maxBpm =
        segmentSessions.length > 0
          ? Math.max(...segmentSessions.map((s) => s.bpm))
          : 0;

      // Format time
      const formatTime = (seconds: number) => {
        if (seconds < 3600) {
          const minutes = Math.floor(seconds / 60);
          return `${minutes}m`;
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
      };

      return {
        name: segment.name,
        time: totalTime / 60, // Keep in minutes for chart scale
        timeFormatted: formatTime(totalTime),
        sessions: avgSessions,
        avgBpm,
        maxBpm,
      };
    });
  }, [sessions, exercises, segments]);

  const metrics = [
    {
      key: "time" as MetricType,
      label: "Practice Time",
      color: "#6366F1",
    },
    {
      key: "sessions" as MetricType,
      label: "Avg Sessions/Exercise",
      color: "#10b981",
    },
    { key: "avgBpm" as MetricType, label: "Average BPM", color: "#f59e0b" },
    { key: "maxBpm" as MetricType, label: "Max BPM", color: "#ef4444" },
  ];

  const currentMetric = metrics.find((m) => m.key === selectedMetric);

  if (!sessions || !exercises || !segments) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">
          Segment Comparison
        </h2>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                selectedMetric === metric.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
            <YAxis stroke="#A0AEC0" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "1px solid #4A5568",
                borderRadius: "0.5rem",
              }}
              cursor={{ fill: "rgba(128,128,128,0.1)" }}
              formatter={(value: number, name: string, props: any) => {
                if (selectedMetric === "time") {
                  return [props.payload.timeFormatted, currentMetric?.label];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar
              dataKey={selectedMetric}
              name={currentMetric?.label}
              fill={currentMetric?.color}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {chartData.map((segment) => (
          <div
            key={segment.name}
            className="bg-gray-700/30 p-3 rounded-lg text-center"
          >
            <div className="text-xs text-gray-400 mb-1">{segment.name}</div>
            <div className="text-xl font-bold text-white">
              {selectedMetric === "time"
                ? segment.timeFormatted
                : segment[selectedMetric]}
              {(selectedMetric === "avgBpm" || selectedMetric === "maxBpm") &&
                " BPM"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentComparisonChart;
