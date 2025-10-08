import { useState } from "react";
import { useMetronome } from "../hooks/useMetronome";

interface MetronomeProps {
  initialBpm?: number;
}

const Metronome = ({ initialBpm = 120 }: MetronomeProps) => {
  const [bpm, setBpm] = useState<number>(initialBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState<number>(4);

  useMetronome({
    bpm,
    beatsPerMeasure,
    isPlaying,
    onBeatChange: setCurrentBeat,
  });

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (newBpm: number) => {
    const clampedBpm = Math.max(40, Math.min(240, newBpm));
    setBpm(clampedBpm);
  };

  const adjustBpm = (delta: number) => {
    handleBpmChange(bpm + delta);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Metronome</h2>

      {/* Visual Beat Indicator */}
      <div className="mb-6">
        <div className="flex gap-2 justify-center mb-4">
          {Array.from({ length: beatsPerMeasure }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-100 ${
                isPlaying && currentBeat === i
                  ? i === 0
                    ? "bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/50"
                    : "bg-green-500 scale-125 shadow-lg shadow-green-500/50"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* BPM Display and Controls */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="text-6xl font-bold text-white font-mono mb-2">
            {bpm}
          </div>
          <div className="text-sm text-gray-400">BPM</div>
        </div>

        {/* BPM Adjustment Buttons */}
        <div className="flex gap-2 justify-center mb-4">
          <button
            type="button"
            onClick={() => adjustBpm(-10)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            -10
          </button>
          <button
            type="button"
            onClick={() => adjustBpm(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            -1
          </button>
          <button
            type="button"
            onClick={() => adjustBpm(1)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => adjustBpm(10)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            +10
          </button>
        </div>

        {/* BPM Slider */}
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => handleBpmChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>40</span>
          <span>240</span>
        </div>
      </div>

      {/* Time Signature */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Beats per Measure
        </label>
        <div className="flex gap-2">
          {[2, 3, 4, 5, 6].map((beats) => (
            <button
              key={beats}
              type="button"
              onClick={() => setBeatsPerMeasure(beats)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${
                beatsPerMeasure === beats
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {beats}
            </button>
          ))}
        </div>
      </div>

      {/* Play/Stop Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`w-full font-bold py-3 px-4 rounded-lg transition ${
          isPlaying
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isPlaying ? "Stop" : "Start"}
      </button>

      {/* Tempo Guide */}
      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <div className="text-xs text-gray-400 text-center">
          {bpm < 60 && "Largo - Very slow"}
          {bpm >= 60 && bpm < 76 && "Adagio - Slow"}
          {bpm >= 76 && bpm < 108 && "Andante - Walking pace"}
          {bpm >= 108 && bpm < 120 && "Moderato - Moderate"}
          {bpm >= 120 && bpm < 168 && "Allegro - Fast"}
          {bpm >= 168 && "Presto - Very fast"}
        </div>
      </div>
    </div>
  );
};

export default Metronome;
