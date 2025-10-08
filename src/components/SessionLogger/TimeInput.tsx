interface TimeInputProps {
  time: string;
  onChange: (time: string) => void;
}

const TimeInput = ({ time, onChange }: TimeInputProps) => {
  return (
    <div>
      <label
        htmlFor="time"
        className="block text-sm font-medium text-gray-400 mb-1"
      >
        Time (minutes)
      </label>
      <input
        type="number"
        id="time"
        value={time}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        placeholder="e.g., 15"
        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>
  );
};

export default TimeInput;
