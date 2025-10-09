import type { IExercise, ISegment } from "../../type";

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
  // Filter exercises by selected segment (only segment-type exercises)
  const filteredExercises = selectedSegment
    ? exercises.filter(
        (ex) => ex.type === "segment" && ex.segmentId === selectedSegment.id
      )
    : exercises.filter((ex) => ex.type === "segment");

  return (
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
  );
};

export default ExerciseSelect;
