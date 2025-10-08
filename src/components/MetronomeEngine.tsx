import { useState } from "react";
import { useMetronome } from "../hooks/useMetronome";

interface MetronomeEngineProps {
  bpm: number;
  isPlaying: boolean;
  beatsPerMeasure?: number;
}

const MetronomeEngine = ({
  bpm,
  isPlaying,
  beatsPerMeasure = 4,
}: MetronomeEngineProps) => {
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  useMetronome({
    bpm,
    beatsPerMeasure,
    isPlaying,
    onBeatChange: setCurrentBeat,
  });

  if (!isPlaying) return null;

  return (
    <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Metronome:</span>
          <div className="flex gap-2">
            {Array.from({ length: beatsPerMeasure }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-100 ${
                  currentBeat === i
                    ? i === 0
                      ? "bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50"
                      : "bg-green-500 scale-125 shadow-lg shadow-green-500/50"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{bpm}</span>
          <span className="text-xs text-gray-400">BPM</span>
        </div>
      </div>
    </div>
  );
};

export default MetronomeEngine;
