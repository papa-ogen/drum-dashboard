import { useState, useMemo } from "react";
import Modal from "./Modal";
import MetronomeEngine from "./MetronomeEngine";
import DrumNotation from "./DrumNotation";
import { useExercises } from "../utils/api";
import type { IExercise } from "../type";

const WarmupList = () => {
  const { exercises } = useExercises();
  const [selectedWarmup, setSelectedWarmup] = useState<IExercise | null>(null);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);

  // Get warm-up exercises from database
  const warmups = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((ex) => ex.type === "warmup");
  }, [exercises]);

  const handleStartWarmup = () => {
    setIsMetronomePlaying(true);
  };

  const handleCloseModal = () => {
    setSelectedWarmup(null);
    setIsMetronomePlaying(false);
  };

  if (!exercises) return null;

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Quick Warm-ups
        </h2>

        <div className="space-y-2">
          {warmups.map((warmup) => (
            <button
              key={warmup.id}
              onClick={() => setSelectedWarmup(warmup)}
              className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 hover:border-indigo-500/50 p-4 rounded-lg transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white group-hover:text-indigo-400 transition">
                  {warmup.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {Math.round((warmup.defaultDuration || 300) / 60)}min
                  </span>
                  <span>•</span>
                  <span>{warmup.defaultBpm || 80} BPM</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1">
                {warmup.description || "Warm-up exercise"}
              </p>
            </button>
          ))}
        </div>

        {warmups.length === 0 && (
          <p className="text-gray-400 text-center py-4 text-sm">
            No warm-up exercises available
          </p>
        )}

        <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <p className="text-xs text-indigo-400 text-center">
            💡 Warm-ups help prevent injury and improve performance
          </p>
        </div>
      </div>

      {/* Warmup Modal */}
      {selectedWarmup && (
        <Modal
          isOpen={!!selectedWarmup}
          onClose={handleCloseModal}
          title={selectedWarmup.name}
        >
          {/* Description */}
          <p className="text-gray-300 mb-6">
            {selectedWarmup.description || "Warm-up exercise"}
          </p>

          {/* Drum Notation */}
          {(selectedWarmup.stickingPattern || selectedWarmup.notation) && (
            <div className="mb-6">
              <DrumNotation
                pattern={selectedWarmup.stickingPattern}
                notation={selectedWarmup.notation}
                noteCount={8}
              />
            </div>
          )}

          {/* Warmup Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Duration</div>
              <div className="text-2xl font-bold text-white">
                {Math.round((selectedWarmup.defaultDuration || 300) / 60)}min
              </div>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Starting BPM</div>
              <div className="text-2xl font-bold text-white">
                {selectedWarmup.defaultBpm || 80}
              </div>
            </div>
          </div>

          {/* Metronome */}
          {isMetronomePlaying && (
            <div className="mb-6">
              <MetronomeEngine
                bpm={selectedWarmup.defaultBpm || 80}
                isPlaying={isMetronomePlaying}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {isMetronomePlaying ? (
              <>
                <button
                  onClick={() => setIsMetronomePlaying(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Stop
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartWarmup}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  Start Warm-up
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default WarmupList;
