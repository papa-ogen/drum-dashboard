interface DateTimeInputProps {
  date: string;
  timeOfDay: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeInput = ({
  date,
  timeOfDay,
  onDateChange,
  onTimeChange,
}: DateTimeInputProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-400 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>
      <div>
        <label
          htmlFor="timeOfDay"
          className="block text-sm font-medium text-gray-400 mb-1"
        >
          Time
        </label>
        <input
          type="time"
          id="timeOfDay"
          value={timeOfDay}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>
    </div>
  );
};

export default DateTimeInput;
