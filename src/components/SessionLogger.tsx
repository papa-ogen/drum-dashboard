import { useState } from "react";
import type { ISession } from "../type";
import { formatDate } from "../utils";
import { useExercises, useSessions } from "../utils/api";

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
      const response = await fetch("http://localhost:3001/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create session.");
      }

      const newSessionFromServer = await response.json();

      // @ts-expect-error - this is a workaround to fix the type error
      setSessions((prevSessions: ISession[]) =>
        [...prevSessions, newSessionFromServer].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );

      // Reset form fields
      setBpm("");
      setTime("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create session."
      );
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
            value={bpm || getHighestBpmSessionForExercise(exercise)?.bpm}
            onChange={(e) => setBpm(e.target.value)}
            placeholder="e.g., 120"
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
