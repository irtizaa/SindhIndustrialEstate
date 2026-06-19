// import { Home, BarChart3, Settings, Map, ChevronLeft, ChevronRight } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { useState } from "react";

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={`h-screen ${
//         collapsed ? "w-20" : "w-54"
//       } bg-[#020d1c] text-white border-r border-white/20 shadow-lg sticky top-0 flex flex-col z-30 transition-all duration-300`}
//     >
//       {/* Logo + Toggle */}
//       <div className="px-4 py-6 border-b border-white/20 flex justify-between items-center">
//         {!collapsed && (
//           <h1 className="text-2xl font-extrabold text-white tracking-wide">GIS Portal</h1>
//         )}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="text-gray-300 hover:text-white transition"
//         >
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-2 py-6 space-y-3">
//         <NavLink
//           to="/dashboard"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <Home className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Dashboard</span>}
//         </NavLink>

//           <NavLink
//           to="/complaints"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <Home className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Complaints</span>}
//         </NavLink>

//         {/* <NavLink
//           to="/analytics"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <BarChart3 className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Analytics</span>}
//         </NavLink> */}


//          <NavLink
//           to="/nationwide"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Analytics</span>}
//         </NavLink>

        
//         <NavLink
//           to="/karachi"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Karachi</span>}
//         </NavLink>


          


//             <NavLink
//           to="/lahore"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Lahore</span>}
//         </NavLink>

//          <NavLink
//           to="/rawalpindi"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
          

          
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Rawalpindi</span>}
//         </NavLink>
        
//           <NavLink
//           to="/kharian"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
          

          
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Kharian</span>}
//         </NavLink>

//          <NavLink
//           to="/peshawar"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
          
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Peshawar</span>}
//         </NavLink>

        

//           <NavLink
//           to="/sialkot"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
          
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Sialkot</span>}
//         </NavLink>


//         {/* <NavLink
//           to="/settings"
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
//               isActive
//                 ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md"
//                 : "text-gray-300 hover:bg-white/10 hover:text-white"
//             }`
//           }
//         >
//           <Settings className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Settings</span>}
//         </NavLink> */}
//       </nav>

//       {!collapsed && (
//         <div className="px-4 py-4 border-t border-white/20 text-gray-400 text-sm text-center">
//           © {new Date().getFullYear()} GIS
//         </div>
//       )}
//     </aside>
//   );
// }

// code before check user permissions and module access rules, with toast notifications for access denial scenarios.                                                  

// import { Home, Map, ChevronLeft, ChevronRight } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { useState } from "react";

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside className={`h-screen ${collapsed ? "w-20" : "w-54"} bg-[#020d1c] text-white border-r border-white/20 shadow-lg sticky top-0 flex flex-col z-30 transition-all duration-300`}>
//       <div className="px-4 py-6 border-b border-white/20 flex justify-between items-center">
//         {!collapsed && <h1 className="text-2xl font-extrabold text-white tracking-wide">GIS Portal</h1>}
//         <button onClick={() => setCollapsed(!collapsed)} className="text-gray-300 hover:text-white transition">
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       <nav className="flex-1 px-2 py-6 space-y-3 overflow-y-auto">
//         {/* Dashboard Home - Visible to all users */}
//         <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Home className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Dashboard</span>}
//         </NavLink>

//         {/* Complaints Tab - Visible to all users */}
//         <NavLink to="/complaints" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Home className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Complaints</span>}
//         </NavLink>

//         {/* Global Overview Analytics view - Visible to all users */}
//         <NavLink to="/nationwide" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Analytics</span>}
//         </NavLink>

//         {/* City Tabs - Visible to all users */}
//         <NavLink to="/karachi" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Karachi</span>}
//         </NavLink>

//         <NavLink to="/lahore" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Lahore</span>}
//         </NavLink>

//         <NavLink to="/rawalpindi" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Rawalpindi</span>}
//         </NavLink>
        
//         <NavLink to="/kharian" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Kharian</span>}
//         </NavLink>

//         <NavLink to="/peshawar" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Peshawar</span>}
//         </NavLink>

//         <NavLink to="/sialkot" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
//           <Map className="w-5 h-5" />
//           {!collapsed && <span className="font-medium">Sialkot</span>}
//         </NavLink>
//       </nav>

//       {!collapsed && (
//         <div className="px-4 py-4 border-t border-white/20 text-gray-400 text-sm text-center">
//           © {new Date().getFullYear()} GIS
//         </div>
//       )}
//     </aside>
//   );
// }





//code with added authorization rules and access denial toast notifications for unauthorized access attempts to modules and 
// features and redirect to same tab
import { Home, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const rawAccess = localStorage.getItem('userAccess');
  const userAccess = rawAccess ? JSON.parse(rawAccess) : [];

  // Helper validation toast notification injector engine
  const showAccessDeniedToast = (message) => {
    const existing = document.getElementById("access-denied-toast");
    if (existing) return;

    const toast = document.createElement("div");
    toast.id = "access-denied-toast";
    toast.innerHTML = `
      <span style="font-size:20px;">🔒</span>
      <div>
        <div style="font-size:14px;font-weight:700;">Access Denied</div>
        <div style="font-size:13px;opacity:.9;">${message}</div>
      </div>
    `;

    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #dc2626, #ef4444)",
      color: "#fff",
      padding: "14px 18px",
      borderRadius: "14px",
      display: "flex",
      gap: "12px",
      alignItems: "center",
      fontWeight: "500",
      zIndex: "999999",
      minWidth: "320px",
      boxShadow: "0 15px 35px rgba(0,0,0,.25)",
      transform: "translateX(400px)",
      transition: "all .35s ease",
      border: "1px solid rgba(255,255,255,.15)",
      backdropFilter: "blur(10px)",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = "translateX(0)"; });

    setTimeout(() => {
      toast.style.transform = "translateX(400px)";
      toast.style.opacity = "0";
      setTimeout(() => { toast.remove(); }, 350);
    }, 2500);
  };

  // Navigates securely only if permissions parameters pass evaluation safely
  const handleNavigation = (targetPath, requiredModuleName, requiredFeature) => {
    if (!requiredModuleName) {
      navigate(targetPath);
      return;
    }

    const moduleMatch = userAccess.find(access => 
      access?.name && access.name.toLowerCase().trim() === requiredModuleName.toLowerCase().trim()
    );

    if (!moduleMatch) {
      showAccessDeniedToast(`You don't have access to ${requiredModuleName}.`);
      return; // Stop right here, don't change the route!
    }

    if (requiredFeature) {
      const allowedFeatures = moduleMatch.features ? moduleMatch.features.split(",") : [];
      const hasFeatureAccess = 
        allowedFeatures.includes("ALL") || 
        allowedFeatures.some(f => f.trim().toLowerCase() === requiredFeature.toLowerCase());

      if (!hasFeatureAccess) {
        showAccessDeniedToast(`You don't have permission to access ${requiredFeature}.`);
        return; // Stop right here, don't change the route!
      }
    }

    navigate(targetPath);
  };

  // Active state highlighting configuration helper class string mapping
  const getLinkClass = (targetPath) => {
    const isActive = location.pathname === targetPath;
    return `w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
      isActive 
        ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md" 
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <aside className={`h-screen ${collapsed ? "w-20" : "w-54"} bg-[#020d1c] text-white border-r border-white/20 shadow-lg sticky top-0 flex flex-col z-30 transition-all duration-300`}>
      <div className="px-4 py-6 border-b border-white/20 flex justify-between items-center">
        {!collapsed && <h1 className="text-2xl font-extrabold text-white tracking-wide">GIS Portal</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-300 hover:text-white transition">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-6 space-y-3 overflow-y-auto">
        <button onClick={() => handleNavigation("/dashboard", "OPTIX Portal", "Dashboard")} className={getLinkClass("/dashboard")}>
          <Home className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Dashboard</span>}
        </button>

        <button onClick={() => handleNavigation("/complaints", "OPTIX Portal", "Complaints")} className={getLinkClass("/complaints")}>
          <Home className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Complaints</span>}
        </button>

        <button onClick={() => handleNavigation("/nationwide", "Optix Portal", "Analytics")} className={getLinkClass("/nationwide")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Analytics</span>}
        </button>

        <button onClick={() => handleNavigation("/karachi", "Optix Portal", "Karachi")} className={getLinkClass("/karachi")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Karachi</span>}
        </button>

        <button onClick={() => handleNavigation("/lahore", "Optix Portal", "Lahore")} className={getLinkClass("/lahore")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Lahore</span>}
        </button>

        <button onClick={() => handleNavigation("/rawalpindi", "Optix Portal", "Rawalpindi")} className={getLinkClass("/rawalpindi")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Rawalpindi</span>}
        </button>
        
        <button onClick={() => handleNavigation("/kharian", "Optix Portal", "Kharian")} className={getLinkClass("/kharian")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Kharian</span>}
        </button>

        <button onClick={() => handleNavigation("/peshawar", "Optix Portal", "Peshawar")} className={getLinkClass("/peshawar")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Peshawar</span>}
        </button>

        <button onClick={() => handleNavigation("/sialkot", "Optix Portal", "Sialkot")} className={getLinkClass("/sialkot")}>
          <Map className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sialkot</span>}
        </button>
      </nav>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/20 text-gray-400 text-sm text-center">
          © {new Date().getFullYear()} GIS
        </div>
      )}
    </aside>
  );
}