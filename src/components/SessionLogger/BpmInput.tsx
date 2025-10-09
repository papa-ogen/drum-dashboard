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

  const getLatestSession = () => {
    if (!sessions || !exerciseId) return null;
    const exerciseSessions = sessions.filter((s) => s.exercise === exerciseId);
    if (exerciseSessions.length === 0) return null;
    return exerciseSessions[exerciseSessions.length - 1];
  };

  const highestSession = getHighestBpmSession();
  const latestSession = getLatestSession();

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
      <div className="mt-1 space-y-1">
        {latestSession?.readyForFaster && (
          <p className="text-xs text-green-400">
            🚀 BPM increased by +1 (you marked ready last time!)
          </p>
        )}
        {highestSession && (
          <p className="text-xs text-gray-400">
            Highest BPM for this exercise: {highestSession.bpm} (on{" "}
            {formatDate(highestSession.date)})
          </p>
        )}
      </div>
    </div>
  );
};

export default BpmInput;
