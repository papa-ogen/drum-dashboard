import type { NotatedBeat, NoteValue } from "../type";

interface DrumNotationProps {
  notation?: NotatedBeat[];
}

const DrumNotation = ({ notation }: DrumNotationProps) => {
  if (!notation) return null;
  return <AdvancedNotation notation={notation} />;
};

// Advanced notation with note values and subdivisions
const AdvancedNotation = ({ notation }: { notation: NotatedBeat[] }) => {
  const drumLabels: Record<string, { name: string; color: string; y: number }> =
    {
      crash: { name: "Crash", color: "bg-orange-500", y: 0 },
      ride: { name: "Ride", color: "bg-cyan-500", y: 1 },
      hihat: { name: "Hi-Hat", color: "bg-yellow-500", y: 2 },
      tom1: { name: "Tom 1", color: "bg-green-500", y: 3 },
      tom2: { name: "Tom 2", color: "bg-green-600", y: 4 },
      snare: { name: "Snare", color: "bg-blue-500", y: 5 },
      tom3: { name: "Tom 3", color: "bg-green-700", y: 6 },
      bass: { name: "Bass", color: "bg-purple-600", y: 7 },
    };

  // Get all unique drums
  const drumsUsed = new Set<string>();
  notation.forEach((beat) => {
    beat.notes.forEach((note) => {
      drumsUsed.add(note.drum);
    });
  });

  const drumRows = Array.from(drumsUsed).sort(
    (a, b) => (drumLabels[a]?.y || 99) - (drumLabels[b]?.y || 99)
  );

  // Note value visual properties
  const getNoteVisual = (value: NoteValue) => {
    switch (value) {
      case "whole":
        return { stemHeight: 0, beams: 0, filled: false, label: "𝅝" };
      case "half":
        return { stemHeight: 20, beams: 0, filled: false, label: "𝅗𝅥" };
      case "quarter":
        return { stemHeight: 20, beams: 0, filled: true, label: "♩" };
      case "8th":
        return { stemHeight: 20, beams: 1, filled: true, label: "♪" };
      case "16th":
        return { stemHeight: 20, beams: 2, filled: true, label: "𝅘𝅥𝅯" };
      case "32nd":
        return { stemHeight: 20, beams: 3, filled: true, label: "𝅘𝅥𝅰" };
      case "triplet":
        return { stemHeight: 20, beams: 1, filled: true, label: "♪³" };
    }
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
      <div className="text-xs text-gray-400 mb-4 text-center font-semibold">
        Drum Notation
      </div>

      {/* Notation grid */}
      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse">
          <tbody>
            {drumRows.map((drum) => (
              <tr key={drum}>
                {/* Drum label */}
                <td className="pr-4 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        drumLabels[drum]?.color || "bg-gray-500"
                      }`}
                    ></div>
                    <div className="text-xs text-gray-300 font-medium whitespace-nowrap">
                      {drumLabels[drum]?.name || drum}
                    </div>
                  </div>
                </td>

                {/* Beats with proper spacing based on note value */}
                {notation.map((beat, beatIndex) => {
                  const noteForThisDrum = beat.notes.find(
                    (n) => n.drum === drum
                  );
                  const visual = getNoteVisual(beat.value);

                  // Calculate width based on note value
                  const widthClass =
                    beat.value === "whole"
                      ? "w-16"
                      : beat.value === "half"
                      ? "w-12"
                      : beat.value === "quarter"
                      ? "w-10"
                      : beat.value === "8th"
                      ? "w-8"
                      : "w-6"; // 16th, 32nd, triplet

                  return (
                    <td
                      key={beatIndex}
                      className={`px-1 py-2 ${widthClass} ${
                        beatIndex % 4 === 0 ? "border-l-2 border-gray-600" : ""
                      }`}
                    >
                      {noteForThisDrum ? (
                        <div className="flex flex-col items-center relative">
                          {/* Accent mark */}
                          {noteForThisDrum.accent && (
                            <div className="text-yellow-400 text-xs mb-1">
                              &gt;
                            </div>
                          )}

                          {/* Sticking */}
                          <div className="text-xs text-gray-300 font-bold mb-1">
                            {noteForThisDrum.hand || noteForThisDrum.foot || ""}
                          </div>

                          {/* Note stem */}
                          {visual.stemHeight > 0 && (
                            <div
                              className="w-0.5 bg-gray-300"
                              style={{ height: `${visual.stemHeight}px` }}
                            ></div>
                          )}

                          {/* Note head */}
                          <div
                            className={`w-3 h-2.5 ${
                              visual.filled
                                ? "bg-gray-300"
                                : "border-2 border-gray-300"
                            } rounded-full ${
                              noteForThisDrum.ghost ? "opacity-40" : ""
                            }`}
                          ></div>

                          {/* Beams */}
                          {visual.beams > 0 && (
                            <div className="absolute top-6 right-0">
                              {Array.from({ length: visual.beams }).map(
                                (_, i) => (
                                  <div
                                    key={i}
                                    className="w-3 h-0.5 bg-gray-300 mb-0.5"
                                    style={{ marginTop: i * 2 }}
                                  ></div>
                                )
                              )}
                            </div>
                          )}

                          {/* Triplet indicator */}
                          {beat.value === "triplet" && (
                            <div className="text-xs text-purple-400 mt-1">
                              3
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`${widthClass} h-12`}></div>
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
      <div className="mt-6 pt-4 border-t border-gray-700 space-y-3">
        {/* Drum legend */}
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

        {/* Note value examples */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <span>♩ = Quarter</span>
          <span>♪ = 8th</span>
          <span>𝅘𝅥𝅯 = 16th</span>
          <span>♪³ = Triplet</span>
        </div>

        {/* Symbols legend */}
        <div className="text-center text-xs text-gray-500">
          R/L = Sticking | &gt; = Accent | Faded = Ghost note
        </div>
      </div>
    </div>
  );
};

export default DrumNotation;
