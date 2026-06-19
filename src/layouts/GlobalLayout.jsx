import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

export default function GlobalLayout({ children }) {
  const location = useLocation();

  // Map routes to titles
  const pageTitles = {
    "/": "Optix Dashboard",
    "/dashboard": "Optix Dashboard",
    "/complaints": "Complaints",
    "/karachi": "Karachi Analytics Dashboard 📊",
    "/lahore": "Lahore Analytics Dashboard 📊",
    "/kharian": "Kharian Analytics Dashboard 📊",
    "/rawalpindi": "Rawalpindi Analytics Dashboard 📊",
    "/sialkot": "Sialkot Analytics Dashboard 📊",
    "/peshawar": "Peshawar",
    "/customer/:customer_id": "customer/:customer_id",
  };

  // Fallback to default if route not in map
  const currentTitle = pageTitles[location.pathname] || "Optix Dashboard";

  return (
    <div className="relative flex h-screen bg-[#0a1a33] text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Pass dynamic title automatically */}
        <Header title={currentTitle} />

        <main
          className="flex-1 p-8 bg-gradient-to-br 
                     from-[#0a1a33]/90 via-[#112240]/90 to-[#1a3355]/90 
                     overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
