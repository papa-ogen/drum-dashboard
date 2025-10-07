import { useMemo } from "react";
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
import { useExercises, useSessions } from "../utils/api";
import { useSegmentContext } from "../hooks/useSegmentContext";

const TotalTimePerExercise = () => {
  const { selectedSegment } = useSegmentContext();
  const {
    sessions,
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
  } = useSessions();
  const {
    exercises,
    isLoading: isLoadingExercises,
    isError: isErrorExercises,
  } = useExercises();

  const exerciseTimeData = useMemo(() => {
    if (!sessions || !exercises) return [];

    // Filter exercises and sessions by segment
    const filteredExercises = selectedSegment
      ? exercises.filter((ex) => ex.segmentId === selectedSegment.id)
      : exercises;

    const filteredSessions = selectedSegment
      ? sessions.filter((s) => {
          const exercise = exercises.find((ex) => ex.id === s.exercise);
          return exercise && exercise.segmentId === selectedSegment.id;
        })
      : sessions;

    const timeMap = filteredSessions.reduce((acc, session) => {
      const { exercise: exerciseId, time } = session;
      acc[exerciseId] = (acc[exerciseId] || 0) + time;
      return acc;
    }, {} as Record<string, number>);

    return filteredExercises
      .map((exercise) => ({
        name: exercise.name,
        time: parseFloat(((timeMap[exercise.id] || 0) / 60).toFixed(1)),
      }))
      .filter((item) => item.time > 0); // Only show exercises with logged time
  }, [sessions, exercises, selectedSegment]);

  if (isLoadingSessions || isLoadingExercises) {
    return <div>Loading...</div>;
  }
  if (isErrorSessions || isErrorExercises) {
    return <div>Error loading sessions or exercises</div>;
  }

  if (!sessions || !exercises) return <div>No data</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Total Time per Exercise
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={exerciseTimeData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis type="number" stroke="#A0AEC0" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#A0AEC0"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "1px solid #4A5568",
              }}
              cursor={{ fill: "rgba(128,128,128,0.1)" }}
            />
            <Legend />
            <Bar dataKey="time" name="Total Minutes" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalTimePerExercise;
