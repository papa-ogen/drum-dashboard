import { useState, useMemo } from "react";
import Modal from "./Modal";
import { useExercises } from "../utils/api";
import type { IExercise } from "../type";

const WarmupList = () => {
  const { exercises } = useExercises();
  const [selectedWarmup, setSelectedWarmup] = useState<IExercise | null>(null);

  // Get warm-up exercises from database
  const warmups = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter((ex) => ex.type === "warmup");
  }, [exercises]);

  // Default settings for warm-ups (can be customized later)
  const getWarmupDefaults = (warmupId: string) => {
    const defaults: Record<
      string,
      { description: string; duration: number; bpm: number }
    > = {
      "warmup-singles": {
        description:
          "Alternate right and left hand single strokes. Focus on evenness and relaxation.",
        duration: 5,
        bpm: 80,
      },
      "warmup-doubles": {
        description:
          "Two strokes per hand (RR-LL-RR-LL). Build control and finger technique.",
        duration: 5,
        bpm: 70,
      },
      "warmup-paradiddles": {
        description:
          "RLRR-LRLL pattern. Classic warm-up for coordination and flow.",
        duration: 5,
        bpm: 60,
      },
      "warmup-accents": {
        description:
          "Practice dynamic control with accented notes. Focus on contrast.",
        duration: 5,
        bpm: 70,
      },
    };

    return (
      defaults[warmupId] || {
        description: "Warm-up exercise",
        duration: 5,
        bpm: 80,
      }
    );
  };

  const handleStartWarmup = () => {
    console.log("Starting warmup:", selectedWarmup);
    // Future: Start timer, metronome, etc.
    setSelectedWarmup(null);
  };

  if (!exercises) return null;

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Quick Warm-ups
        </h2>

        <div className="space-y-2">
          {warmups.map((warmup) => {
            const defaults = getWarmupDefaults(warmup.id);
            return (
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
                    <span>{defaults.duration}min</span>
                    <span>•</span>
                    <span>{defaults.bpm} BPM</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {defaults.description}
                </p>
              </button>
            );
          })}
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
          onClose={() => setSelectedWarmup(null)}
          title={selectedWarmup.name}
        >
          {(() => {
            const defaults = getWarmupDefaults(selectedWarmup.id);
            return (
              <>
                {/* Description */}
                <p className="text-gray-300 mb-6">{defaults.description}</p>

                {/* Warmup Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Duration</div>
                    <div className="text-2xl font-bold text-white">
                      {defaults.duration}min
                    </div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">
                      Starting BPM
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {defaults.bpm}
                    </div>
                  </div>
                </div>

                {/* Placeholder for future features */}
                <div className="bg-gray-700/30 p-8 rounded-lg mb-6 border-2 border-dashed border-gray-600">
                  <p className="text-gray-400 text-sm text-center">
                    Timer and metronome controls will go here
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedWarmup(null)}
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
                </div>
              </>
            );
          })()}
        </Modal>
      )}
    </>
  );
};

export default WarmupList;
