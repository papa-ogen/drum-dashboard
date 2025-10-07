import { useState, useEffect, useMemo } from "react";
import type { IExercise, ISession } from "./type";
import SessionLogger from "./components/SessionLogger";
import { formatDate } from "./utils";
import AlbumSearch from "./components/AlbumSearch";
import KeyStats from "./components/KeyStats";
import TotalTimePerExercise from "./components/TotalTimePerExercise";
import ChartContainer from "./components/ChartContainer";

export default function App() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState("1");

  const [selectedExercise, setSelectedExercise] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sessionsRes, exercisesRes] = await Promise.all([
          fetch("http://localhost:3001/api/sessions"),
          fetch("http://localhost:3001/api/exercises"),
        ]);

        if (!sessionsRes.ok || !exercisesRes.ok) {
          throw new Error("Network response was not ok");
        }
        const sessionsData = await sessionsRes.json();
        const exercisesData = await exercisesRes.json();

        setSessions(sessionsData);
        setExercises(exercisesData);
        if (exercisesData.length > 0) {
          setExercise(String(exercisesData[0].id)); // Set default form selection
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Is the server running?");
        setSessions([]);
        setExercises([]);

        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Memoized Data for Charts & KPIs ---
  const processedData = useMemo(() => {
    return sessions.map((s) => ({
      ...s,
      displayDate: formatDate(s.date),
      timeInMinutes: s.time / 60,
    }));
  }, [sessions]);

  const filteredData = useMemo(() => {
    if (selectedExercise === "all") {
      return processedData;
    }

    return processedData.filter((s) => s.exercise === selectedExercise);
  }, [processedData, selectedExercise]);

  // Function to get the highest BPM session for a specific exercise ID

  const exerciseTimeData = useMemo(() => {
    const timeMap = sessions.reduce((acc, session) => {
      const { exercise: exerciseId, time } = session;
      acc[exerciseId] = (acc[exerciseId] || 0) + time;
      return acc;
    }, {} as Record<string, number>);

    return exercises.map((exercise) => ({
      name: exercise.name,
      time: parseFloat(((timeMap[exercise.id] || 0) / 60).toFixed(1)),
    }));
  }, [sessions, exercises]);

  // --- Render Logic ---
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Drum Progress Dashboard
          </h1>
          <p className="text-indigo-400 mt-1">
            Keep the rhythm going. Log your practice sessions below.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <SessionLogger
              exercises={exercises}
              exercise={exercise}
              setExercise={setExercise}
              sessions={sessions}
              setSessions={setSessions}
              setError={setError}
              error={error}
            />

            <KeyStats exercises={exercises} sessions={sessions} />

            <AlbumSearch />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-96 bg-gray-800 rounded-2xl">
                <p className="text-lg">Loading your progress...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex justify-center items-center h-96 bg-gray-800 rounded-2xl">
                <p className="text-lg text-center p-4">
                  No data yet. Log your first session to see the charts!
                </p>
              </div>
            ) : (
              <>
                <ChartContainer
                  exercises={exercises}
                  filteredData={filteredData}
                  selectedExercise={selectedExercise}
                  setSelectedExercise={setSelectedExercise}
                />

                <TotalTimePerExercise exerciseTimeData={exerciseTimeData} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
