import { useState, useEffect } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import {
  useExercises,
  useSessions,
  useSegments,
  postSession,
  API_ENDPOINTS,
} from "../../utils/api";
import { getExercisesBySegment } from "../../utils/segments";
import { useSegmentContext } from "../../hooks/useSegmentContext";
import { useAchievements } from "../../hooks/useAchievements";
import { ACHIEVEMENT_DEFINITIONS } from "../../data/achievements";
import Timer from "../Timer";
import MetronomeEngine from "../MetronomeEngine";
import DateTimeInput from "./DateTimeInput";
import ExerciseSelect from "./ExerciseSelect";
import BpmInput from "./BpmInput";
import BpmProgressCheckbox from "./BpmProgressCheckbox";
import TimeInput from "./TimeInput";

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

  // Form state
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [timeOfDay, setTimeOfDay] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  );
  const [bpm, setBpm] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [exercise, setExercise] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [readyForFaster, setReadyForFaster] = useState<boolean>(false);

  // Metronome state
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);

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
  }, [selectedSegment]);

  // Auto-fill with most recent session when no exercise is selected
  useEffect(() => {
    if (
      sessions &&
      sessions.length > 0 &&
      !exercise &&
      exercises &&
      selectedSegment
    ) {
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
  }, [selectedSegment, sessions?.length]);

  // Update BPM, time, and timer when exercise changes
  useEffect(() => {
    if (exercise && sessions) {
      const exerciseSessions = sessions.filter((s) => s.exercise === exercise);

      if (exerciseSessions.length > 0) {
        const latestForExercise = exerciseSessions[exerciseSessions.length - 1];

        // If last session was marked as ready for faster, increment BPM by 1
        const newBpm = latestForExercise.readyForFaster
          ? latestForExercise.bpm + 1
          : latestForExercise.bpm;

        setBpm(newBpm.toString());
        setTime((latestForExercise.time / 60).toString());
        setTimerDuration(latestForExercise.time);
        setReadyForFaster(false); // Reset checkbox
      } else {
        setBpm("");
        setTime("");
        setTimerDuration(0);
        setReadyForFaster(false);
      }

      // Update time to current time when exercise changes
      setTimeOfDay(new Date().toTimeString().slice(0, 5));
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

  // Timer handlers
  const handleTimerComplete = (practicedSeconds: number) => {
    const minutes = Math.ceil(practicedSeconds / 60);
    setTime(minutes.toString());
    setIsMetronomePlaying(false);
  };

  const handleTimerReset = () => {
    setTime("");
    setIsMetronomePlaying(false);
  };

  const handleTimerStart = () => {
    setIsMetronomePlaying(true);
  };

  const handleTimerPause = () => {
    setIsMetronomePlaying(false);
  };

  const handleTimerResume = () => {
    setIsMetronomePlaying(true);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !exercise || !bpm || !time) {
      setError("Please fill out all fields.");
      return;
    }
    setError(null);

    const dateISO = `${date}T${timeOfDay}:00.000Z`;

    const sessionPayload = {
      date: dateISO,
      exercise,
      bpm: parseInt(bpm),
      time: parseInt(time) * 60,
      readyForFaster,
    };

    try {
      await postSession(sessionPayload);
      await mutate(API_ENDPOINTS.SESSIONS);

      setTimeout(() => {
        mutate(API_ENDPOINTS.ACHIEVEMENTS);
      }, 100);

      const exerciseName =
        exercises?.find((e) => e.id === exercise)?.name || "Exercise";
      toast.success(
        `Session added! ${exerciseName} at ${bpm} BPM for ${time} min`
      );

      // Auto-advance to next exercise
      if (exercises) {
        const filteredExercises = selectedSegment
          ? exercises.filter(
              (ex) =>
                ex.type === "segment" && ex.segmentId === selectedSegment.id
            )
          : exercises.filter((ex) => ex.type === "segment");

        const currentIndex = filteredExercises.findIndex(
          (e) => e.id === exercise
        );
        if (
          currentIndex !== -1 &&
          currentIndex < filteredExercises.length - 1
        ) {
          // Move to next exercise
          const nextExercise = filteredExercises[currentIndex + 1];
          setExercise(nextExercise.id);
        } else if (
          currentIndex === filteredExercises.length - 1 &&
          filteredExercises.length > 0
        ) {
          // At the end, wrap around to first exercise
          setExercise(filteredExercises[0].id);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create session.";
      toast.error(errorMessage);
    }
  };

  // Loading and error states
  if (isLoadingSessions || isLoadingExercises || isLoadingSegments) {
    return <div>Loading...</div>;
  }
  if (isErrorSessions || isErrorExercises || isErrorSegments) {
    return <div>Error loading data</div>;
  }
  if (!sessions || !exercises || !segments) return <div>No data</div>;

  // Prepare data for ExerciseSelect (only segment exercises)
  const filteredExercises = selectedSegment
    ? exercises.filter(
        (ex) => ex.type === "segment" && ex.segmentId === selectedSegment.id
      )
    : exercises.filter((ex) => ex.type === "segment");
  const exercisesBySegment = getExercisesBySegment(filteredExercises, segments);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Log New Session
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <DateTimeInput
          date={date}
          timeOfDay={timeOfDay}
          onDateChange={setDate}
          onTimeChange={setTimeOfDay}
        />

        <ExerciseSelect
          exercise={exercise}
          exercises={exercises}
          segments={segments}
          selectedSegment={selectedSegment}
          exercisesBySegment={exercisesBySegment}
          onChange={setExercise}
        />

        <BpmInput
          bpm={bpm}
          exerciseId={exercise}
          sessions={sessions}
          onChange={setBpm}
        />

        <BpmProgressCheckbox
          checked={readyForFaster}
          onChange={setReadyForFaster}
        />

        <MetronomeEngine
          bpm={parseInt(bpm) || 120}
          isPlaying={isMetronomePlaying}
        />

        <Timer
          initialDuration={timerDuration}
          onTimeComplete={handleTimerComplete}
          onReset={handleTimerReset}
          onStart={handleTimerStart}
          onPause={handleTimerPause}
          onResume={handleTimerResume}
        />

        <TimeInput time={time} onChange={setTime} />

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
