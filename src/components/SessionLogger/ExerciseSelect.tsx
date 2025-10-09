import { useState } from "react";
import type { IExercise, ISegment } from "../../type";
import ExerciseInfoModal from "../ExerciseInfoModal";

interface ExerciseSelectProps {
  exercise: string;
  exercises: IExercise[];
  segments: ISegment[];
  selectedSegment: ISegment | null;
  exercisesBySegment: Map<ISegment, IExercise[]>;
  onChange: (exerciseId: string) => void;
}

const ExerciseSelect = ({
  exercise,
  exercises,
  selectedSegment,
  exercisesBySegment,
  onChange,
}: ExerciseSelectProps) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Get the currently selected exercise object
  const selectedExercise = exercises.find((ex) => ex.id === exercise);

  // Filter exercises by selected segment (only segment-type exercises)
  const filteredExercises = selectedSegment
    ? exercises.filter(
        (ex) => ex.type === "segment" && ex.segmentId === selectedSegment.id
      )
    : exercises.filter((ex) => ex.type === "segment");

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="exercise"
            className="block text-sm font-medium text-gray-400"
          >
            Exercise
          </label>
          {exercise && selectedExercise && (
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="text-indigo-400 hover:text-indigo-300 transition"
              title="View exercise details"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>
        <select
          id="exercise"
          value={exercise}
          onChange={(e) => onChange(e.target.value)}
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

      {/* Exercise Info Modal */}
      {selectedExercise && (
        <ExerciseInfoModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          exercise={selectedExercise}
        />
      )}
    </>
  );
};

export default ExerciseSelect;
