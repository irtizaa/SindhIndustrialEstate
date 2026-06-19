// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Header() {
//   const location = useLocation();
//   const navigate = useNavigate(); // Hook to enable navigation

//   // 🔹 Map route paths to page titles
//   const titles = {
//     "/dashboard": "Dashboard",
//     "/complaints": "Complaints",
//     "/analytics": "Analytics",
//     "/settings": "Settings",
//     "/karachi": "Karachi",
//     "/lahore": "Lahore",
//     "/rawalpindi": "Rawalpindi",
//     "/kharian": "Kharian",
//     "/peshawar": "Peshawar",
//     "/nationwide": "Nationwide",
//     "/sialkot": "Sialkot",
//     "/customer/:customer_id": "customer/:customer_id",
//   };

//   const pageTitle = titles[location.pathname] || "Optix Dashboard";

//   /**
//    * Clears the user's authentication token from local storage
//    * and redirects them to the login page.
//    */
//   const handleLogout = () => {
//     // 1. Clear the token used for authentication checks
//     localStorage.removeItem('userToken'); 

//     // 2. Redirect the user to the login page
//     navigate('/login'); 
//   };

//   return (
//     <header className="bg-[#020d1c] border-b border-white/20 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
//       <h2 className="text-xl font-bold text-white">{pageTitle}</h2>

//       {/* Attached the handleLogout function to the button */}
//       <button 
//         onClick={handleLogout}
//         className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition shadow-md"
//       >
//         Logout
//       </button>
//     </header>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Header() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     customers: 0,
//     olts: 0,
//     fiberLength: "0 m"
//   });

//   const titles = {
//     "/dashboard": "Dashboard",
//     "/complaints": "Complaints",
//     "/nationwide": "Nationwide",
//     "/karachi": "Karachi",
//     "/lahore": "Lahore",
//     "/rawalpindi": "Rawalpindi",
//     "/kharian": "Kharian",
//     "/peshawar": "Peshawar",
//     "/sialkot": "Sialkot",
//   };

//   const pageTitle = titles[location.pathname] || "Optix Dashboard";

//   useEffect(() => {
//     const fetchAndFilterData = async () => {
//       // 1. Determine the target city from the URL
//       const path = location.pathname.split("/")[1]; // e.g., "karachi"
//       const currentCity = path.charAt(0).toUpperCase() + path.slice(1);

//       // Skip logic for non-city pages
//       if (["dashboard", "settings", "login", ""].includes(path)) return;

//       try {
//         const [fiberRes, customerRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/n_metroFiber"),
//           axios.get("http://localhost:5000/api/n_customers")
//         ]);

//         // 2. FRONT-END "WHERE" CLAUSE LOGIC
//         // If the path is 'nationwide', we show everything. Otherwise, we filter by City.
//         const isNationwide = path === "nationwide";

//         const filteredFiber = isNationwide 
//           ? fiberRes.data 
//           : fiberRes.data.filter(item => item.City === currentCity);

//         const filteredCustomers = isNationwide 
//           ? customerRes.data 
//           : customerRes.data.filter(item => item.City === currentCity);

//         // 3. AGGREGATION
//         const totalFiberMeters = filteredFiber.reduce((sum, item) => sum + (item.Calculated_Length || 0), 0);

//         // Count unique OLT IDs from the filtered customer list
//         const uniqueOlts = [...new Set(filteredCustomers.map(c => c.OLT_ID))].filter(Boolean).length;

//         setStats({
//           customers: filteredCustomers.length,
//           olts: uniqueOlts,
//           fiberLength: totalFiberMeters > 1000 
//             ? `${(totalFiberMeters / 1000).toFixed(2)} km` 
//             : `${totalFiberMeters} m`
//         });

//       } catch (error) {
//         console.error("Error filtering stats on frontend:", error);
//       }
//     };

//     fetchAndFilterData();
//   }, [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem('userToken'); 
//     navigate('/login'); 
//   };

//   return (
//     <header className="bg-[#020d1c] border-b border-white/20 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
//       <div className="flex items-center gap-8">
//         <h2 className="text-xl font-bold text-white whitespace-nowrap">{pageTitle}</h2>

//         {/* Stats Ribbon */}
//         {!["/dashboard", "/settings", "/login"].includes(location.pathname) && (
//           <div className="flex items-center gap-6 border-l border-white/20 pl-8">
//             <StatItem label="Customers" value={stats.customers} color="text-pink-400" />
//             <StatItem label="Active OLTs" value={stats.olts} color="text-purple-400" />
//             <StatItem label="Metro Fiber" value={stats.fiberLength} color="text-indigo-400" />
//           </div>
//         )}
//       </div>

//       <button 
//         onClick={handleLogout}
//         className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition shadow-md"
//       >
//         Logout
//       </button>
//     </header>
//   );
// }

// function StatItem({ label, value, color }) {
//   return (
//     <div className="flex flex-col">
//       <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</span>
//       <span className={`text-lg font-bold ${color}`}>{value}</span>
//     </div>
//   );
// }



// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Users, Server, Box, Share2, Activity, Layers, Link2 } from "lucide-react"; 

// export default function Header() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const cache = useRef({ 
//     fiber: null, 
//     customers: null, 
//     olts: null, 
//     fdts: null, 
//     fats: null,
//     handholes: null,
//     joints: null
//   });

//   const rawEmail =
//     JSON.parse(localStorage.getItem("userData"))?.user?.email || "";

//   const userName =
//     location.pathname === "/dashboard"
//       ? `Hello ${rawEmail.split("@")[0]?.split(".")[0]?.toUpperCase() || "USER"}!`
//       : "";

//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const [stats, setStats] = useState({
//     customers: 0,
//     olts: 0,
//     fdts: 0,
//     fats: 0,
//     handholes: 0,
//     joints: 0,
//     fiberLength: "0 m"
//   });

//   const titles = {
//     "/dashboard": "Dashboard",
//     "/complaints": "Complaints",
//     "/nationwide": "Nationwide",
//     "/karachi": "Karachi",
//     "/lahore": "Lahore",
//     "/rawalpindi": "Rawalpindi",
//     "/kharian": "Kharian",
//     "/peshawar": "Peshawar",
//     "/sialkot": "Sialkot",
//   };

//   const pageTitle = titles[location.pathname] || "Optix Dashboard";

//   const filterByCity = (data, currentCity, isNationwide) =>
//     isNationwide ? data : data.filter(item => item.City?.toLowerCase() === currentCity.toLowerCase());

//   const updateStats = () => {
//     const path = location.pathname.split("/")[1];
//     const currentCity = path.charAt(0).toUpperCase() + path.slice(1);

//     if (["dashboard", "complaints", "settings", "login", ""].includes(path)) return;
//     if (!cache.current.fiber) return;

//     const isNationwide = path === "nationwide";

//     const filteredFiber = filterByCity(cache.current.fiber || [], currentCity, isNationwide);
//     const filteredCustomers = filterByCity(cache.current.customers || [], currentCity, isNationwide);
//     const filteredOlts = filterByCity(cache.current.olts || [], currentCity, isNationwide);
//     const filteredFdts = filterByCity(cache.current.fdts || [], currentCity, isNationwide);
//     const filteredFats = filterByCity(cache.current.fats || [], currentCity, isNationwide);
//     const filteredHH = filterByCity(cache.current.handholes || [], currentCity, isNationwide);
//     const filteredJoints = filterByCity(cache.current.joints || [], currentCity, isNationwide);

//     const totalFiberMeters = filteredFiber.reduce(
//       (sum, item) => sum + (item.Calculated_Length || 0), 
//       0
//     );

//     setStats({
//       customers: filteredCustomers.length,
//       olts: filteredOlts.length,
//       fdts: filteredFdts.length,
//       fats: filteredFats.length,
//       handholes: filteredHH.length,
//       joints: filteredJoints.length,
//       fiberLength: totalFiberMeters > 1000 
//         ? `${(totalFiberMeters / 1000).toFixed(2)} km` 
//         : `${totalFiberMeters} m`
//     });

//     setIsRefreshing(true);
//     setTimeout(() => setIsRefreshing(false), 1000);
//   };

//   useEffect(() => {
//     const fetchStaticData = async () => {
//       try {
//         const [
//           customerRes, 
//           oltRes, 
//           fdtRes, 
//           fatRes, 
//           hhRes, 
//           jointRes
//         ] = await Promise.all([
//           axios.get("http://localhost:5000/api/n_customers"),
//           axios.get("http://localhost:5000/api/N_nodes"),
//           axios.get("http://localhost:5000/api/n_fdtPon"),
//           axios.get("http://localhost:5000/api/n_fat_splitter"),
//           axios.get("http://localhost:5000/api/n_handholes"),
//           axios.get("http://localhost:5000/api/n_joints")
//         ]);

//         cache.current = {
//           ...cache.current,
//           customers: customerRes.data || [],
//           olts: oltRes.data || [],
//           fdts: fdtRes.data || [],
//           fats: fatRes.data || [],
//           handholes: hhRes.data || [],
//           joints: jointRes.data || []
//         };

//         updateStats();
//       } catch (error) {
//         console.error("Static Data Fetch Error:", error);
//       }
//     };

//     const fetchDynamicFiber = async () => {
//       try {
//         const fiberRes = await axios.get("http://localhost:5000/api/n_metroFiber");
//         cache.current.fiber = fiberRes.data;
//         updateStats();
//       } catch (error) {
//         console.error("Fiber Fetch Error:", error);
//       }
//     };

//     fetchStaticData();
//     fetchDynamicFiber();

//     const interval = setInterval(fetchDynamicFiber, 6000);
//     return () => clearInterval(interval);

//   }, []);

//   useEffect(() => updateStats(), [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("userToken");
//     navigate("/login");
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".user-dropdown")) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="bg-[#020d1c]/95 border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-20 shadow-2xl backdrop-blur-xl">
//       <style>{`
//         .pulse-text { animation: pulse-animation 1s ease-in-out; }
//         @keyframes pulse-animation {
//           0% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.05); filter: brightness(1.5); }
//           100% { opacity: 1; transform: scale(1); }
//         }
//         .no-scrollbar::-webkit-scrollbar { display: none; }

//         @keyframes fadeInDropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-8px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeInDropdown 0.18s ease-out;
//         }
//       `}</style>

//       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full flex-grow">
//         <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-6 w-full sm:w-auto">
//           {pageTitle}
//         </h2>

//         {!["/dashboard", "/complaints", "/settings", "/login"].includes(location.pathname) && (
//           <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
//             <StatCard label="Customers" value={stats.customers} color="text-pink-400" icon={<Users size={14}/>} refreshing={isRefreshing} />
//             <StatCard label="OLTs" value={stats.olts} color="text-purple-400" icon={<Server size={14}/>} refreshing={isRefreshing} />
//             <StatCard label="FDTs" value={stats.fdts} color="text-blue-400" icon={<Box size={14}/>} refreshing={isRefreshing} />
//             <StatCard label="FATs" value={stats.fats} color="text-emerald-400" icon={<Share2 size={14}/>} refreshing={isRefreshing} />
//             <StatCard label="Handholes" value={stats.handholes} color="text-yellow-400" icon={<Layers size={14}/>} refreshing={isRefreshing} />
//             <StatCard label="Joints" value={stats.joints} color="text-red-400" icon={<Link2 size={14}/>} refreshing={isRefreshing} />
//             <StatCard label="Infra" value={stats.fiberLength} color="text-indigo-400" icon={<Activity size={14}/>} refreshing={isRefreshing} />
//           </div>
//         )}
//       </div>

//       {location.pathname === "/dashboard" && (
//         <div className="relative mt-3 sm:mt-0 user-dropdown">

//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md whitespace-nowrap"
//           >
//             <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
//               {rawEmail?.charAt(0)?.toUpperCase() || "U"}
//             </div>
//             <span className="text-sm text-white font-semibold">
//               {userName}
//             </span>
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-44 bg-[#0b1a2f] border border-white/10 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
//               {/* <button
//                 onClick={() => {
//                   setDropdownOpen(false);
//                   navigate("/profile");
//                 }}
//                 className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
//               >
//                 Profile
//               </button> */}

//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </header>
//   );
// }

// function StatCard({ label, value, color, icon, refreshing }) {
//   return (
//     <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 min-w-[110px] sm:min-w-[130px] backdrop-blur-md hover:border-white/20 hover:bg-white/10 transition-all shadow-inner group">
//       <div className={`p-2 rounded-lg bg-black/40 ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
//         {icon}
//       </div>
//       <div className="flex flex-col">
//         <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
//           {label}
//         </span>
//         <span className={`text-sm sm:text-lg font-black tracking-tight ${color} ${refreshing ? 'pulse-text' : ''}`}>
//           {value}
//         </span>
//       </div>
//     </div>
//   );
// }

//code before check user permissions and module access rules, with toast notifications for access denial scenarios.
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Users, Server, Box, Share2, Activity, Layers, Link2 } from "lucide-react";

// export default function Header() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const cache = useRef({
//     fiber: null,
//     fiberAttachment: null,
//     customers: null,
//     olts: null,
//     fdts: null,
//     fats: null,
//     handholes: null,
//     joints: null
//   });

//   const rawEmail =
//     JSON.parse(localStorage.getItem("userData"))?.user?.email || "";

//   const userName =
//     location.pathname === "/dashboard"
//       ? `Hello ${rawEmail.split("@")[0]?.split(".")[0]?.toUpperCase() || "USER"}!`
//       : "";

//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const [stats, setStats] = useState({
//     customers: 0,
//     olts: 0,
//     fdts: 0,
//     fats: 0,
//     handholes: 0,
//     joints: 0,
//     fiberLength: "0 m",
//     fiberCount: "0.00 KM",
//     faCount: "0.00 KM"
//   });

//   const titles = {
//     "/dashboard": "Dashboard",
//     "/complaints": "Complaints",
//     "/nationwide": "Nationwide",
//     "/karachi": "Karachi",
//     "/lahore": "Lahore",
//     "/rawalpindi": "Rawalpindi",
//     "/kharian": "Kharian",
//     "/peshawar": "Peshawar",
//     "/sialkot": "Sialkot",
//   };

//   const pageTitle = titles[location.pathname] || "Optix Dashboard";

//   const filterByCity = (data, currentCity, isNationwide) =>
//     isNationwide ? data : data.filter(item => item.City?.toLowerCase() === currentCity.toLowerCase());

//   const updateStats = () => {
//     const path = location.pathname.split("/")[1];
//     const currentCity = path.charAt(0).toUpperCase() + path.slice(1);

//     if (["dashboard", "complaints", "settings", "login", ""].includes(path)) return;
//     if (!cache.current.fiber) return;

//     const isNationwide = path === "nationwide";

//     const filteredFiber = filterByCity(cache.current.fiber || [], currentCity, isNationwide);
//     const filteredFiberAttachment = filterByCity(cache.current.fiberAttachment || [], currentCity, isNationwide);
//     const filteredCustomers = filterByCity(cache.current.customers || [], currentCity, isNationwide);
//     const filteredOlts = filterByCity(cache.current.olts || [], currentCity, isNationwide);
//     const filteredFdts = filterByCity(cache.current.fdts || [], currentCity, isNationwide);
//     const filteredFats = filterByCity(cache.current.fats || [], currentCity, isNationwide);
//     const filteredHH = filterByCity(cache.current.handholes || [], currentCity, isNationwide);
//     const filteredJoints = filterByCity(cache.current.joints || [], currentCity, isNationwide);

//     /* Summing lengths matching the formula format used in reference component */
//     const metroMeters = filteredFiber.reduce((sum, item) => {
//       const val = parseFloat(item.Calculated_Length);
//       return sum + (isNaN(val) ? 0 : val);
//     }, 0);

//     const attachmentMeters = filteredFiberAttachment.reduce((sum, item) => {
//       const val = parseFloat(item.Calculated_Length);
//       return sum + (isNaN(val) ? 0 : val);
//     }, 0);

//     const totalFiberMeters = metroMeters + attachmentMeters;

//     setStats({
//       customers: filteredCustomers.length,
//       olts: filteredOlts.length,
//       fdts: filteredFdts.length,
//       fats: filteredFats.length,
//       handholes: filteredHH.length,
//       joints: filteredJoints.length,
//       fiberLength: totalFiberMeters > 1000
//         ? `${(totalFiberMeters / 1000).toFixed(2)} km`
//         : `${totalFiberMeters} m`,
//       /* Maps directly to the breakdown matching your database calculations */
//       fiberCount: `${(metroMeters * 0.001).toFixed(2)} KM`,
//       faCount: `${(attachmentMeters * 0.001).toFixed(2)} KM`
//     });

//     setIsRefreshing(true);
//     setTimeout(() => setIsRefreshing(false), 1000);
//   };

//   useEffect(() => {
//     const fetchStaticData = async () => {
//       try {
//         const [
//           customerRes,
//           oltRes,
//           fdtRes,
//           fatRes,
//           hhRes,
//           jointRes
//         ] = await Promise.all([
//           axios.get("http://localhost:5000/api/n_customers"),
//           axios.get("http://localhost:5000/api/N_nodes"),
//           axios.get("http://localhost:5000/api/n_fdtPon"),
//           axios.get("http://localhost:5000/api/n_fat_splitter"),
//           axios.get("http://localhost:5000/api/n_handholes"),
//           axios.get("http://localhost:5000/api/n_joints")
//         ]);

//         cache.current = {
//           ...cache.current,
//           customers: customerRes.data || [],
//           olts: oltRes.data || [],
//           fdts: fdtRes.data || [],
//           fats: fatRes.data || [],
//           handholes: hhRes.data || [],
//           joints: jointRes.data || []
//         };

//         updateStats();
//       } catch (error) {
//         console.error("Static Data Fetch Error:", error);
//       }
//     };

//     const fetchDynamicFiber = async () => {
//       try {
//         const [fiberRes, fiberAttachmentRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/n_metroFiber"),
//           axios.get("http://localhost:5000/api/n_fa")
//         ]);

//         cache.current.fiber = fiberRes.data || [];
//         cache.current.fiberAttachment = fiberAttachmentRes.data || [];

//         updateStats();
//       } catch (error) {
//         console.error("Fiber Fetch Error:", error);
//       }
//     };

//     fetchStaticData();
//     fetchDynamicFiber();

//     const interval = setInterval(fetchDynamicFiber, 6000);
//     return () => clearInterval(interval);

//   }, []);

//   useEffect(() => updateStats(), [location.pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("userToken");
//     navigate("/login");
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".user-dropdown")) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="bg-[#020d1c]/95 border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-20 shadow-2xl backdrop-blur-xl overflow-visible">
//       <style>{`
//         .pulse-text { animation: pulse-animation 1s ease-in-out; }
//         @keyframes pulse-animation {
//           0% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.05); filter: brightness(1.5); }
//           100% { opacity: 1; transform: scale(1); }
//         }

//         .no-scrollbar::-webkit-scrollbar { 
//           display: none; 
//         }

//         @keyframes fadeInDropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-8px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeInDropdown 0.18s ease-out;
//         }

//         .infra-tooltip {
//           opacity: 0;
//           visibility: hidden;
//           transform: translateX(-50%) translateY(-6px) scale(0.95);
//           transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), 
//                       transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), 
//                       visibility 0.2s;
//         }

//         .group:hover .infra-tooltip {
//           opacity: 1;
//           visibility: visible;
//           transform: translateX(-50%) translateY(0) scale(1);
//         }
//       `}</style>

//       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full flex-grow overflow-visible">
//         <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-6 w-full sm:w-auto">
//           {pageTitle}
//         </h2>

//         {!["/dashboard", "/complaints", "/settings", "/login"].includes(location.pathname) && (
//           <div className="w-full sm:w-auto overflow-visible">
//             <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 overflow-x-auto overflow-y-visible no-scrollbar py-1 w-full sm:w-auto">
//               <StatCard label="Customers" value={stats.customers} color="text-pink-400" icon={<Users size={14} />} refreshing={isRefreshing} />
//               <StatCard label="OLTs" value={stats.olts} color="text-purple-400" icon={<Server size={14} />} refreshing={isRefreshing} />
//               <StatCard label="FDTs" value={stats.fdts} color="text-blue-400" icon={<Box size={14} />} refreshing={isRefreshing} />
//               <StatCard label="FATs" value={stats.fats} color="text-emerald-400" icon={<Share2 size={14} />} refreshing={isRefreshing} />
//               <StatCard label="Handholes" value={stats.handholes} color="text-yellow-400" icon={<Layers size={14} />} refreshing={isRefreshing} />
//               <StatCard label="Joints" value={stats.joints} color="text-red-400" icon={<Link2 size={14} />} refreshing={isRefreshing} />
//               <StatCard
//                 label="Infra"
//                 value={stats.fiberLength}
//                 color="text-indigo-400"
//                 icon={<Activity size={14} />}
//                 refreshing={isRefreshing}
//                 fiberCount={stats.fiberCount}
//                 faCount={stats.faCount}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {location.pathname === "/dashboard" && (
//         <div className="relative mt-3 sm:mt-0 user-dropdown">

//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md whitespace-nowrap"
//           >
//             <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
//               {rawEmail?.charAt(0)?.toUpperCase() || "U"}
//             </div>
//             <span className="text-sm text-white font-semibold">
//               {userName}
//             </span>
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-44 bg-[#0b1a2f] border border-white/10 rounded-lg shadow-lg overflow-hidden animate-fadeIn">

//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </header>
//   );
// }

// function StatCard({ 
//   label, 
//   value, 
//   color, 
//   icon, 
//   refreshing, 
//   fiberCount, 
//   faCount 
// }) {

//   const isInfraCard = label === "Infra";

//   return (
//     <div 
//       className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 min-w-[110px] sm:min-w-[130px] backdrop-blur-md hover:border-white/20 hover:bg-white/10 transition-all shadow-inner group relative overflow-visible"
//     >
//       <div className={`p-2 rounded-lg bg-black/40 ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
//         {icon}
//       </div>

//       <div className="flex flex-col">
//         <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
//           {label}
//         </span>

//         <span className={`text-sm sm:text-lg font-black tracking-tight ${color} ${refreshing ? 'pulse-text' : ''}`}>
//           {value}
//         </span>

//         {isInfraCard && (
//           <div className="flex items-center gap-1 mt-1">
//             <div className="flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
//               <span className="text-[10px] text-indigo-300 font-semibold">
//                 Fiber: {fiberCount}
//               </span>
//             </div>

//             <div className="flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
//               <span className="text-[10px] text-cyan-300 font-semibold">
//                 FA: {faCount}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



//code with added authorization rules and access denial toast notifications for unauthorized access attempts to modules and 
// features and redirect to same tab

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Server, Box, Share2, Activity, Layers, Link2 } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const cache = useRef({
    fiber: null,
    fiberAttachment: null,
    customers: null,
    olts: null,
    fdts: null,
    fats: null,
    handholes: null,
    joints: null
  });

  const rawEmail =
    JSON.parse(localStorage.getItem("userData"))?.user?.email || "";

  const userName =
    location.pathname === "/dashboard"
      ? `Hello ${rawEmail.split("@")[0]?.split(".")[0]?.toUpperCase() || "USER"}!`
      : "";

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [stats, setStats] = useState({
    customers: 0,
    olts: 0,
    fdts: 0,
    fats: 0,
    handholes: 0,
    joints: 0,
    fiberLength: "0 m",
    fiberCount: "0.00 KM",
    faCount: "0.00 KM"
  });

  const titles = {
    "/dashboard": "Dashboard",
    "/complaints": "Complaints",
    "/nationwide": "Nationwide",
    "/karachi": "Karachi",
    "/lahore": "Lahore",
    "/rawalpindi": "Rawalpindi",
    "/kharian": "Kharian",
    "/peshawar": "Peshawar",
    "/sialkot": "Sialkot",
  };

  const pageTitle = titles[location.pathname] || "Optix Dashboard";

  const filterByCity = (data, currentCity, isNationwide) =>
    isNationwide ? data : data.filter(item => item.City?.toLowerCase() === currentCity.toLowerCase());

  const updateStats = () => {
    const path = location.pathname.split("/")[1];
    const currentCity = path.charAt(0).toUpperCase() + path.slice(1);

    if (["dashboard", "complaints", "settings", "login", ""].includes(path)) return;
    if (!cache.current.fiber) return;

    const isNationwide = path === "nationwide";

    const filteredFiber = filterByCity(cache.current.fiber || [], currentCity, isNationwide);
    const filteredFiberAttachment = filterByCity(cache.current.fiberAttachment || [], currentCity, isNationwide);
    const filteredCustomers = filterByCity(cache.current.customers || [], currentCity, isNationwide);
    const filteredOlts = filterByCity(cache.current.olts || [], currentCity, isNationwide);
    const filteredFdts = filterByCity(cache.current.fdts || [], currentCity, isNationwide);
    const filteredFats = filterByCity(cache.current.fats || [], currentCity, isNationwide);
    const filteredHH = filterByCity(cache.current.handholes || [], currentCity, isNationwide);
    const filteredJoints = filterByCity(cache.current.joints || [], currentCity, isNationwide);

    /* Summing lengths matching the formula format used in reference component */
    const metroMeters = filteredFiber.reduce((sum, item) => {
      const val = parseFloat(item.Calculated_Length);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const attachmentMeters = filteredFiberAttachment.reduce((sum, item) => {
      const val = parseFloat(item.Calculated_Length);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const totalFiberMeters = metroMeters + attachmentMeters;

    setStats({
      customers: filteredCustomers.length,
      olts: filteredOlts.length,
      fdts: filteredFdts.length,
      fats: filteredFats.length,
      handholes: filteredHH.length,
      joints: filteredJoints.length,
      fiberLength: totalFiberMeters > 1000
        ? `${(totalFiberMeters / 1000).toFixed(2)} km`
        : `${totalFiberMeters} m`,
      /* Maps directly to the breakdown matching your database calculations */
      fiberCount: `${(metroMeters * 0.001).toFixed(2)} KM`,
      faCount: `${(attachmentMeters * 0.001).toFixed(2)} KM`
    });

    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [
          customerRes,
          oltRes,
          fdtRes,
          fatRes,
          hhRes,
          jointRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/n_customers"),
          axios.get("http://localhost:5000/api/N_nodes"),
          axios.get("http://localhost:5000/api/n_fdtPon"),
          axios.get("http://localhost:5000/api/n_fat_splitter"),
          axios.get("http://localhost:5000/api/n_handholes"),
          axios.get("http://localhost:5000/api/n_joints")
        ]);

        cache.current = {
          ...cache.current,
          customers: customerRes.data || [],
          olts: oltRes.data || [],
          fdts: fdtRes.data || [],
          fats: fatRes.data || [],
          handholes: hhRes.data || [],
          joints: jointRes.data || []
        };

        updateStats();
      } catch (error) {
        console.error("Static Data Fetch Error:", error);
      }
    };

    const fetchDynamicFiber = async () => {
      try {
        const [fiberRes, fiberAttachmentRes] = await Promise.all([
          axios.get("http://localhost:5000/api/n_metroFiber"),
          axios.get("http://localhost:5000/api/n_fa")
        ]);

        cache.current.fiber = fiberRes.data || [];
        cache.current.fiberAttachment = fiberAttachmentRes.data || [];

        updateStats();
      } catch (error) {
        console.error("Fiber Fetch Error:", error);
      }
    };

    fetchStaticData();
    fetchDynamicFiber();

    const interval = setInterval(fetchDynamicFiber, 6000);
    return () => clearInterval(interval);

  }, []);

  useEffect(() => updateStats(), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#020d1c]/95 border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center sticky top-0 z-20 shadow-2xl backdrop-blur-xl overflow-visible">
      <style>{`
        .pulse-text { animation: pulse-animation 1s ease-in-out; }
        @keyframes pulse-animation {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); filter: brightness(1.5); }
          100% { opacity: 1; transform: scale(1); }
        }

        .no-scrollbar::-webkit-scrollbar { 
          display: none; 
        }

        @keyframes fadeInDropdown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeInDropdown 0.18s ease-out;
        }

        .infra-tooltip {
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-6px) scale(0.95);
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      visibility 0.2s;
        }

        .group:hover .infra-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0) scale(1);
        }
      `}</style>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full flex-grow overflow-visible">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-6 w-full sm:w-auto">
          {pageTitle}
        </h2>

        {!["/dashboard", "/complaints", "/settings", "/login"].includes(location.pathname) && (
          <div className="w-full sm:w-auto overflow-visible">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 overflow-x-auto overflow-y-visible no-scrollbar py-1 w-full sm:w-auto">
              <StatCard label="Customers" value={stats.customers} color="text-pink-400" icon={<Users size={14} />} refreshing={isRefreshing} />
              <StatCard label="OLTs" value={stats.olts} color="text-purple-400" icon={<Server size={14} />} refreshing={isRefreshing} />
              <StatCard label="FDTs" value={stats.fdts} color="text-blue-400" icon={<Box size={14} />} refreshing={isRefreshing} />
              <StatCard label="FATs" value={stats.fats} color="text-emerald-400" icon={<Share2 size={14} />} refreshing={isRefreshing} />
              <StatCard label="Handholes" value={stats.handholes} color="text-yellow-400" icon={<Layers size={14} />} refreshing={isRefreshing} />
              <StatCard label="Joints" value={stats.joints} color="text-red-400" icon={<Link2 size={14} />} refreshing={isRefreshing} />
              <StatCard
                label="Infra"
                value={stats.fiberLength}
                color="text-indigo-400"
                icon={<Activity size={14} />}
                refreshing={isRefreshing}
                fiberCount={stats.fiberCount}
                faCount={stats.faCount}
              />
            </div>
          </div>
        )}
      </div>

      {/* {location.pathname === "/dashboard" && ( */}
        <div className="relative mt-3 sm:mt-0 user-dropdown">

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md whitespace-nowrap"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              {rawEmail?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-white font-semibold">
              {userName}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#0b1a2f] border border-white/10 rounded-lg shadow-lg overflow-hidden animate-fadeIn">

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      {/* )} */}
    </header>
  );
}

function StatCard({ 
  label, 
  value, 
  color, 
  icon, 
  refreshing, 
  fiberCount, 
  faCount 
}) {

  const isInfraCard = label === "Infra";

  return (
    <div 
      className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 min-w-[110px] sm:min-w-[130px] backdrop-blur-md hover:border-white/20 hover:bg-white/10 transition-all shadow-inner group relative overflow-visible"
    >
      <div className={`p-2 rounded-lg bg-black/40 ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
          {label}
        </span>

        <span className={`text-sm sm:text-lg font-black tracking-tight ${color} ${refreshing ? 'pulse-text' : ''}`}>
          {value}
        </span>

        {isInfraCard && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span className="text-[10px] text-indigo-300 font-semibold">
                Fiber: {fiberCount}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-[10px] text-cyan-300 font-semibold">
                FA: {faCount}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}