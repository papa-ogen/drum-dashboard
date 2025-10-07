import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IExercise } from "../type";

const TimeChart = ({
  filteredData,
  selectedExercise,
  exercises,
}: {
  filteredData: {
    displayDate: string;
    timeInMinutes: number;
    id: string;
    date: string;
    exercise: string;
    bpm: number;
    time: number;
  }[];
  selectedExercise: string;
  exercises: IExercise[];
}) => {
  return (
    <div className="h-64 mt-8">
      <h3 className="text-lg font-medium text-indigo-300 mb-2">
        Duration Trend (minutes)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="displayDate" stroke="#A0AEC0" fontSize={12} />
          <YAxis stroke="#A0AEC0" fontSize={12} domain={[0, "dataMax + 5"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
          />
          <Legend />
          {selectedExercise === "all" ? (
            <Line
              type="monotone"
              dataKey="timeInMinutes"
              name="Minutes (All)"
              stroke="#f6ad55"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="timeInMinutes"
              name={`${
                exercises.find((e) => e.id === selectedExercise)?.name
              } Mins`}
              stroke="#e53e3e"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeChart;
