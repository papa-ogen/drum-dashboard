import type { ISession } from "../../type";
import { formatDate } from "../../utils";

interface BpmInputProps {
  bpm: string;
  exerciseId: string;
  sessions: ISession[];
  onChange: (bpm: string) => void;
}

const BpmInput = ({ bpm, exerciseId, sessions, onChange }: BpmInputProps) => {
  const getHighestBpmSession = () => {
    if (!sessions || !exerciseId) return null;

    const exerciseSessions = sessions.filter((s) => s.exercise === exerciseId);
    if (exerciseSessions.length === 0) return null;

    return exerciseSessions.reduce((max, session) =>
      session.bpm > max.bpm ? session : max
    );
  };

  const highestSession = getHighestBpmSession();

  return (
    <div>
      <label
        htmlFor="bpm"
        className="block text-sm font-medium text-gray-400 mb-1"
      >
        BPM
      </label>
      <input
        type="number"
        id="bpm"
        value={bpm}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        placeholder="e.g., 120"
        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
      {highestSession && (
        <p className="text-xs text-gray-400 mt-1">
          Highest BPM for this exercise: {highestSession.bpm} (on{" "}
          {formatDate(highestSession.date)})
        </p>
      )}
    </div>
  );
};

export default BpmInput;
