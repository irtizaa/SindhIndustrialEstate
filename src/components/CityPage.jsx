import { useParams, Link } from "react-router-dom";

export default function CityPage() {
  const { name } = useParams();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Welcome to {name.charAt(0).toUpperCase() + name.slice(1)}
        </h1>
        <p className="text-gray-600 mb-6">
          This is the city-specific screen. You can add your data, maps, or dashboard here 🚀
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
