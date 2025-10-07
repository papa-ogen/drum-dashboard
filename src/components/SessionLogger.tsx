import { useState, useEffect } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { formatDate } from "../utils";
import {
  useExercises,
  useSessions,
  useSegments,
  postSession,
  API_ENDPOINTS,
} from "../utils/api";
import { getExercisesBySegment } from "../utils/segments";
import { useSegmentContext } from "../hooks/useSegmentContext";
import { useAchievements } from "../hooks/useAchievements";
import { ACHIEVEMENT_DEFINITIONS } from "../data/achievements";

const SessionLogger = () => {
  const { selectedSegment } = useSegmentContext();
  const { newlyUnlocked, clearNewlyUnlocked } = useAchievements();
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
  const {
    segments,
    isLoading: isLoadingSegments,
    isError: isErrorSegments,
  } = useSegments();
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [bpm, setBpm] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Reset exercise when segment changes if current exercise doesn't belong to new segment
  useEffect(() => {
    if (selectedSegment && exercise && exercises) {
      const currentExercise = exercises.find((e) => e.id === exercise);
      if (currentExercise && currentExercise.segmentId !== selectedSegment.id) {
        setExercise("");
        setBpm("");
        setTime("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment]); // Only run when segment changes

  // Auto-fill with most recent session when no exercise is selected
  useEffect(() => {
    if (
      sessions &&
      sessions.length > 0 &&
      !exercise &&
      exercises &&
      selectedSegment
    ) {
      // Get filtered sessions based on selected segment
      const filteredSessionsData = sessions.filter((s) => {
        const ex = exercises.find((e) => e.id === s.exercise);
        return ex && ex.segmentId === selectedSegment.id;
      });

      if (filteredSessionsData.length > 0) {
        const latestSession = filteredSessionsData[0];
        setExercise(latestSession.exercise);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment, sessions?.length]); // Only run when segment changes or sessions load

  // Update BPM and time when exercise changes
  useEffect(() => {
    if (exercise && sessions) {
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

  // Show toast for newly unlocked achievements
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach((achievementId) => {
        const achievement = ACHIEVEMENT_DEFINITIONS.find(
          (a) => a.id === achievementId
        );
        if (achievement) {
          toast.success(
            `🎉 Achievement Unlocked: ${achievement.icon} ${achievement.name}!`,
            {
              duration: 5000,
              style: {
                background: "#1f2937",
                color: "#f3f4f6",
                border: "2px solid #6366F1",
              },
            }
          );
        }
      });
      clearNewlyUnlocked();
    }
  }, [newlyUnlocked, clearNewlyUnlocked]);

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

      // Small delay to ensure achievement checking happens after sessions update
      setTimeout(() => {
        mutate(API_ENDPOINTS.ACHIEVEMENTS);
      }, 100);

      // Show success toast
      const exerciseName =
        exercises?.find((e) => e.id === exercise)?.name || "Exercise";
      toast.success(
        `Session added! ${exerciseName} at ${bpm} BPM for ${time} min`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create session.";
      toast.error(errorMessage);
    }
  };

  if (isLoadingSessions || isLoadingExercises || isLoadingSegments) {
    return <div>Loading...</div>;
  }
  if (isErrorSessions || isErrorExercises || isErrorSegments) {
    return <div>Error loading data</div>;
  }

  if (!sessions || !exercises || !segments) return <div>No data</div>;

  // Filter exercises by selected segment
  const filteredExercises = selectedSegment
    ? exercises.filter((ex) => ex.segmentId === selectedSegment.id)
    : exercises;

  const exercisesBySegment = getExercisesBySegment(filteredExercises, segments);

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
            {selectedSegment
              ? // When a segment is selected, show flat list
                filteredExercises.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))
              : // When "All Time" is selected, show grouped by segment
                Array.from(exercisesBySegment.entries()).map(
                  ([segment, segmentExercises]) => (
                    <optgroup key={segment.id} label={segment.name}>
                      {segmentExercises.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                )}
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
