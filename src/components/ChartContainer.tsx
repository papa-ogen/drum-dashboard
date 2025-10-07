import BpmChart from "./BpmChart";
import TimeChart from "./TimeChart";
import type { IExercise } from "../type";

const ChartContainer = ({
  exercises,
  filteredData,
  selectedExercise,
  setSelectedExercise,
}: {
  exercises: IExercise[];
  filteredData: {
    displayDate: string;
    timeInMinutes: number;
    id: string;
    date: string;
    exercise: string;
    bpm: number;
    time: number;
  }[];
  selectedExercise: string;
  setSelectedExercise: (exercise: string) => void;
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">
          Progress Over Time
        </h2>
        <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
          {["all", ...exercises.map((e) => e.id)].map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExercise(ex)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                selectedExercise === ex
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-600"
              }`}
            >
              {ex === "all" ? "All" : exercises.find((e) => e.id === ex)?.name}
            </button>
          ))}
        </div>
      </div>
      <BpmChart
        filteredData={filteredData}
        selectedExercise={selectedExercise}
        exercises={exercises}
      />
      <TimeChart
        filteredData={filteredData}
        selectedExercise={selectedExercise}
        exercises={exercises}
      />
    </div>
  );
};

export default ChartContainer;
