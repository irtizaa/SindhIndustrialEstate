// components/charts/ComplaintsOverTime.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ComplaintsOverTime({ data }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-2">Complaints Over Time</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date"/>
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
