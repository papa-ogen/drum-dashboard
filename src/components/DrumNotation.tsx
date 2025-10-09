import type { DrumNote } from "../type";

interface DrumNotationProps {
  pattern?: string; // Simple pattern like "RLRL" (backwards compatible)
  notation?: DrumNote[][]; // Advanced notation
  noteCount?: number;
}

const DrumNotation = ({
  pattern,
  notation,
  noteCount = 8,
}: DrumNotationProps) => {
  // If we have advanced notation, use that
  if (notation) {
    return <AdvancedNotation notation={notation} />;
  }

  // Otherwise fall back to simple sticking pattern
  if (pattern) {
    return <SimpleStickingPattern pattern={pattern} noteCount={noteCount} />;
  }

  return null;
};

// Simple sticking pattern display (original)
const SimpleStickingPattern = ({
  pattern,
  noteCount,
}: {
  pattern: string;
  noteCount: number;
}) => {
  const cleanPattern = pattern.replace(/[\s-]/g, "");
  const sticking = [];
  for (let i = 0; i < noteCount; i++) {
    sticking.push(cleanPattern[i % cleanPattern.length]);
  }

  const patternLength = cleanPattern.length;
  const groups = [];
  for (let i = 0; i < sticking.length; i += patternLength) {
    groups.push(sticking.slice(i, i + patternLength));
  }

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <div className="text-xs text-gray-400 mb-3 text-center">
        Sticking Pattern
      </div>

      <div className="flex justify-center items-center gap-2 mb-4">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-1">
            {group.map((hand, handIndex) => (
              <div
                key={`${groupIndex}-${handIndex}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  hand === "R"
                    ? "bg-blue-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {hand}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center">
        <span className="text-xs font-mono text-gray-400">{pattern}</span>
      </div>
    </div>
  );
};

// Advanced multi-voice drum notation
const AdvancedNotation = ({ notation }: { notation: DrumNote[][] }) => {
  const drumLabels: Record<string, { name: string; color: string }> = {
    snare: { name: "Snare", color: "bg-blue-500" },
    bass: { name: "Bass", color: "bg-purple-600" },
    hihat: { name: "Hi-Hat", color: "bg-yellow-500" },
    tom1: { name: "Tom 1", color: "bg-green-500" },
    tom2: { name: "Tom 2", color: "bg-green-600" },
    tom3: { name: "Tom 3", color: "bg-green-700" },
    ride: { name: "Ride", color: "bg-cyan-500" },
    crash: { name: "Crash", color: "bg-orange-500" },
  };

  // Get all unique drums used in this notation
  const drumsUsed = new Set<string>();
  notation.forEach((beat) => {
    beat.forEach((note) => {
      drumsUsed.add(note.drum);
    });
  });

  const drumRows = Array.from(drumsUsed).sort();

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <div className="text-xs text-gray-400 mb-3 text-center">
        Drum Notation
      </div>

      {/* Notation grid */}
      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse">
          <tbody>
            {drumRows.map((drum) => (
              <tr key={drum}>
                {/* Drum label */}
                <td className="pr-3 py-1">
                  <div className="text-xs text-gray-400 font-medium text-right whitespace-nowrap">
                    {drumLabels[drum]?.name || drum}
                  </div>
                </td>

                {/* Beats */}
                {notation.map((beat, beatIndex) => {
                  const noteForThisDrum = beat.find((n) => n.drum === drum);
                  return (
                    <td
                      key={beatIndex}
                      className="px-2 py-1 border-l border-gray-700"
                    >
                      {noteForThisDrum ? (
                        <div className="flex flex-col items-center">
                          {/* Note circle with hand/foot indicator */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              drumLabels[drum]?.color || "bg-gray-500"
                            } text-white ${
                              noteForThisDrum.accent
                                ? "ring-2 ring-yellow-400 scale-110"
                                : ""
                            }`}
                          >
                            {noteForThisDrum.hand ||
                              noteForThisDrum.foot ||
                              "•"}
                          </div>
                        </div>
                      ) : (
                        <div className="w-8 h-8"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          {drumRows.map((drum) => (
            <div key={drum} className="flex items-center gap-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  drumLabels[drum]?.color || "bg-gray-500"
                }`}
              ></div>
              <span className="text-gray-400">
                {drumLabels[drum]?.name || drum}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          R = Right hand/foot | L = Left hand/foot | Ring = Accent
        </div>
      </div>
    </div>
  );
};

export default DrumNotation;
