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
const BpmChart = ({
  filteredData,
  selectedExercise,
  exercises,
}: {
  filteredData: {
    displayDate: string;
    bpm: number;
    id: string;
    date: string;
    exercise: string;
    time: number;
  }[];
  selectedExercise: string;
  exercises: IExercise[];
}) => {
  return (
    <div className="h-64 mt-6">
      <h3 className="text-lg font-medium text-indigo-300 mb-2">BPM Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="displayDate" stroke="#A0AEC0" fontSize={12} />
          <YAxis
            stroke="#A0AEC0"
            fontSize={12}
            domain={["dataMin - 10", "dataMax + 10"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              border: "1px solid #4A5568",
            }}
          />
          <Legend />
          {selectedExercise === "all" ? (
            <>
              <Line
                type="monotone"
                dataKey="bpm"
                name="BPM (All)"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="bpm"
              name={`${
                exercises.find((e) => e.id === selectedExercise)?.name
              } BPM`}
              stroke="#82ca9d"
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

export default BpmChart;
