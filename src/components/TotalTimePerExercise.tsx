import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TotalTimePerExercise = ({
  exerciseTimeData,
}: {
  exerciseTimeData: { name: string; time: number }[];
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Total Time per Exercise
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={exerciseTimeData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis type="number" stroke="#A0AEC0" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#A0AEC0"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A202C",
                border: "1px solid #4A5568",
              }}
              cursor={{ fill: "rgba(128,128,128,0.1)" }}
            />
            <Legend />
            <Bar dataKey="time" name="Total Minutes" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalTimePerExercise;
