import GlobalLayout from "../layouts/GlobalLayout";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsLayout({ city, stats, complaintsData, revenueData }) {
  return (
    <GlobalLayout>
      <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
        {city} Analytics Dashboard 📊
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complaints Chart */}
        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-xl shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Monthly Complaints
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#CBD5E1" />
              <YAxis stroke="#CBD5E1" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E293B", borderRadius: "0.5rem", color: "white" }}
              />
              <Bar dataKey="complaints" fill="#60A5FA" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-xl shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#CBD5E1" />
              <YAxis stroke="#CBD5E1" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E293B", borderRadius: "0.5rem", color: "white" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlobalLayout>
  );
}

/* ✅ Stat Card Component */
function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg flex items-center justify-between 
                  bg-gradient-to-r ${color} text-white`}
    >
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-full">{icon}</div>
    </div>
  );
}
