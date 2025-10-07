import { useState, useEffect } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { formatDate } from "../utils";
import {
  useExercises,
  useSessions,
  postSession,
  API_ENDPOINTS,
} from "../utils/api";

const SessionLogger = () => {
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
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [bpm, setBpm] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form with the most recent session on initial load
  useEffect(() => {
    if (sessions && sessions.length > 0 && !exercise) {
      // Select the first session
      const latestSession = sessions[0];
      setExercise(latestSession.exercise);
    }
  }, [sessions, exercise]);

  // Update BPM and time when exercise changes
  useEffect(() => {
    if (sessions && exercise) {
      // Find the most recent session for the selected exercise
      const exerciseSessions = sessions.filter((s) => s.exercise === exercise);

      if (exerciseSessions.length > 0) {
        const latestForExercise = exerciseSessions[exerciseSessions.length - 1];
        setBpm(latestForExercise.bpm.toString());
        setTime((latestForExercise.time / 60).toString()); // Convert seconds to minutes
      } else {
        // No previous sessions for this exercise, clear the fields
        setBpm("");
        setTime("");
      }
    }
  }, [exercise, sessions]);

  const getHighestBpmSessionForExercise = (exerciseId: string) => {
    if (!sessions) return null;

    const exerciseSessions = sessions.filter((s) => s.exercise === exerciseId);
    if (exerciseSessions.length === 0) return null;

    const highestSession = exerciseSessions.reduce((max, session) =>
      session.bpm > max.bpm ? session : max
    );

    return highestSession;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !exercise || !bpm || !time) {
      setError("Please fill out all fields.");
      return;
    }
    setError(null);

    const sessionPayload = {
      date,
      exercise, // this is the exercise ID from the form state
      bpm: parseInt(bpm),
      time: parseInt(time) * 60, // Convert minutes to seconds
    };

    try {
      await postSession(sessionPayload);

      // Revalidate the sessions data to refresh the UI
      // The useEffect will automatically pre-fill with the latest session
      await mutate(API_ENDPOINTS.SESSIONS);

      // Show success toast
      const exerciseName =
        exercises?.find((e) => e.id === exercise)?.name || "Exercise";
      toast.success(
        `Session added! ${exerciseName} at ${bpm} BPM for ${time} min`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create session.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isLoadingSessions || isLoadingExercises) {
    return <div>Loading...</div>;
  }
  if (isErrorSessions || isErrorExercises) {
    return <div>Error loading sessions or exercises</div>;
  }

  if (!sessions || !exercises) return <div>No data</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Log New Session
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label
            htmlFor="exercise"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Exercise
          </label>
          <select
            id="exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">Select an exercise</option>
            {exercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="bpm"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            BPM
          </label>
          <input
            type="number"
            id="bpm"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder={
              getHighestBpmSessionForExercise(exercise)?.bpm?.toString() ||
              "e.g., 120"
            }
            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          {(() => {
            const highestSession = getHighestBpmSessionForExercise(exercise);
            return highestSession ? (
              <p className="text-xs text-gray-400 mt-1">
                Highest BPM for this exercise: {highestSession.bpm} (on{" "}
                {formatDate(highestSession.date)})
              </p>
            ) : null;
          })()}
        </div>
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Time (minutes)
          </label>
          <input
            type="number"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="e.g., 15"
            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Add Session
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default SessionLogger;
