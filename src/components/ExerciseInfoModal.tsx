import Modal from "./Modal";
import DrumNotation from "./DrumNotation";
import type { IExercise } from "../type";

interface ExerciseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: IExercise;
}

const ExerciseInfoModal = ({
  isOpen,
  onClose,
  exercise,
}: ExerciseInfoModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name}
      maxWidth="lg"
    >
      {exercise.description && (
        <p className="text-gray-300 mb-6">{exercise.description}</p>
      )}

      {(exercise.stickingPattern || exercise.notation) && (
        <div className="mb-6">
          <DrumNotation
            pattern={exercise.stickingPattern}
            notation={exercise.notation}
            noteCount={8}
          />
        </div>
      )}

      {(exercise.defaultBpm || exercise.defaultDuration) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {exercise.defaultDuration && (
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">
                Suggested Duration
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(exercise.defaultDuration / 60)}min
              </div>
            </div>
          )}
          {exercise.defaultBpm && (
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Starting BPM</div>
              <div className="text-2xl font-bold text-white">
                {exercise.defaultBpm}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        Got it!
      </button>
    </Modal>
  );
};

export default ExerciseInfoModal;
