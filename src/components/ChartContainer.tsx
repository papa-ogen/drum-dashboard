import BpmChart from "./BpmChart";
import TimeChart from "./TimeChart";
import { useExercises, useSessions } from "../utils/api";
import { useMemo, useState, useEffect } from "react";
import { formatDate } from "../utils";
import { useSegmentContext } from "../hooks/useSegmentContext";

const ChartContainer = () => {
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
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  // Filter exercises by segment
  const availableExercises = useMemo(() => {
    if (!exercises) return [];
    return selectedSegment
      ? exercises.filter((ex) => ex.segmentId === selectedSegment.id)
      : exercises;
  }, [exercises, selectedSegment]);

  // Process and filter sessions by segment
  const processedData = useMemo(() => {
    if (!sessions || !exercises) return [];

    // Filter sessions by segment first
    const segmentFilteredSessions = selectedSegment
      ? sessions.filter((s) => {
          const exercise = exercises.find((ex) => ex.id === s.exercise);
          return exercise && exercise.segmentId === selectedSegment.id;
        })
      : sessions;

    return segmentFilteredSessions.map((s) => ({
      ...s,
      displayDate: formatDate(s.date),
      timeInMinutes: s.time / 60,
    }));
  }, [sessions, exercises, selectedSegment]);

  const filteredData = useMemo(() => {
    if (!selectedExercise) {
      return processedData;
    }
    return processedData.filter((s) => s.exercise === selectedExercise);
  }, [processedData, selectedExercise]);

  // Auto-select first exercise when segment changes or exercises load
  useEffect(() => {
    if (availableExercises.length > 0) {
      setSelectedExercise(availableExercises[0].id);
    }
  }, [availableExercises]);

  if (isLoadingSessions || isLoadingExercises) {
    return <div>Loading...</div>;
  }
  if (isErrorSessions || isErrorExercises) {
    return <div>Error loading sessions or exercises</div>;
  }

  if (!sessions || !exercises) return <div>No data</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">
          Progress Over Time
        </h2>
        <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
          {availableExercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExercise(ex.id)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                selectedExercise === ex.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-600"
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>
      <BpmChart
        filteredData={filteredData}
        selectedExercise={selectedExercise}
        exercises={availableExercises}
      />
      <TimeChart
        filteredData={filteredData}
        selectedExercise={selectedExercise}
        exercises={availableExercises}
      />
    </div>
  );
};

export default ChartContainer;
