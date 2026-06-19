// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";

// export default function Dashboard() {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();

//   const cities = [
//     { name: "Karachi", color: "from-pink-500 to-red-500", path: "/city/karachi" },
//     { name: "Lahore", color: "from-green-500 to-emerald-500", path: "/city/lahore" },
//     { name: "Rawalpindi", color: "from-blue-500 to-indigo-500", path: "/city/rawalpindi" },
//     { name: "Peshawar", color: "from-purple-500 to-pink-500", path: "/city/peshawar" },
//     { name: "Khariyan", color: "from-orange-500 to-yellow-500", path: "/city/khariyan" },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar collapsed={collapsed} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <Header collapsed={collapsed} setCollapsed={setCollapsed} />

//         <motion.main
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex-1 p-6"
//         >
//           <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//             Select a City
//           </h2>

//           {/* Cities Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {cities.map((city, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.98 }}
//                 className={`cursor-pointer bg-gradient-to-r ${city.color} rounded-xl shadow-lg p-6 text-white flex items-center justify-center text-2xl font-bold transition`}
//                 onClick={() => navigate(city.path)}
//               >
//                 {city.name}
//               </motion.div>
//             ))}
//           </div>                                
//         </motion.main>
//       </div>        
//     </div>
//   );
// }

import GlobalLayout from "../layouts/GlobalLayout";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Karachi from "./cities/Karachi";
import Lahore from "./cities/Lahore";
import Peshawar from "./cities/Peshawar";
import Khariyan from "./cities/Khariyan";
import Rawalpindi from "./cities/Rawalpindi";
import Sialkot from "./cities/Sialkot";
import MainLayout from "../layouts/MainLayout";
import NewDashboard from "./NewDashboard"

export default function Dashboard() {
  return (
    <div>
       <MainLayout>
 <NewDashboard/>
       </MainLayout>
     
    </div>
    //    <MainLayout>
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //       <Karachi />
    //       <Lahore />
    //       <Peshawar />
    //       <Khariyan />
    //       <Rawalpindi />
    //       <Sialkot />
          
    //     </div>           
    //  </MainLayout>
  );
}

// smart olt merge data

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MergedCustomerOLT = () => {
//   const [mergedData, setMergedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [duplicateIds, setDuplicateIds] = useState(new Set());

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch APIs in parallel
//         const [customerRes, smartOLTRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/n_customers"),
//           axios.get("http://localhost:4000/api/olt_statuses"),
//         ]);

//         const customerData = Array.isArray(customerRes.data)
//           ? customerRes.data
//           : customerRes.data.data || [];

//         const smartOLTData = Array.isArray(smartOLTRes.data.response)
//           ? smartOLTRes.data.response
//           : [];

//         // Count Customer_ID occurrences
//         const customerIdCount = {};
//         customerData.forEach(customer => {
//           const id = String(customer.Customer_ID || "").trim();
//           if (!id) return;
//           customerIdCount[id] = (customerIdCount[id] || 0) + 1;
//         });

//         // Identify duplicate IDs
//         const duplicates = new Set(
//           Object.keys(customerIdCount).filter(id => customerIdCount[id] > 1)
//         );
//         setDuplicateIds(duplicates);

//         // Build OLT lookup map (fast)
//         const oltMap = new Map(
//           smartOLTData.map(olt => [
//             String(olt.unique_external_id || "").trim(),
//             olt,
//           ])
//         );

//         // Merge only matching records
//         const merged = customerData
//           .map(customer => {
//             const customerIdStr = String(customer.Customer_ID || "").trim();
//             const oltMatch = oltMap.get(customerIdStr);

//             if (!oltMatch) return null;

//             return {
//               Customer_ID: customer.Customer_ID,
//               Customer_Name: customer.Customer_Name,
//               OLT_Name: customer.OLT_Name,
//               Ring_Name: customer.Ring_Name,
//               Latitude: customer.Latitude,
//               Longitude: customer.Longitude,
//               OLT_ID: oltMatch.olt_id,
//               OLT_Status: oltMatch.status,
//             };
//           })
//           .filter(Boolean);

//         setMergedData(merged);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError(err.message || "Failed to fetch data from APIs.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p>Loading data...</p>;
//   if (error) return <p>{error}</p>;
//   if (!mergedData.length) return <p>No matching records found.</p>;

//   return (
//     <div>
//       <h2>Merged Customer & OLT Data</h2>

//       <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>Customer ID</th>
//             <th>Customer Name</th>
//             <th>OLT Name</th>
//             <th>Ring Name</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>OLT ID</th>
//             <th>OLT Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {mergedData.map((item, index) => {
//             const isDuplicate = duplicateIds.has(
//               String(item.Customer_ID || "").trim()
//             );

//             return (
//               <tr
//                 key={`${item.Customer_ID}-${index}`}
//                 style={{
//                   backgroundColor: isDuplicate ? "#ffe5e5" : "transparent",
//                 }}
//               >
//                 <td>{item.Customer_ID}</td>
//                 <td>{item.Customer_Name}</td>
//                 <td>{item.OLT_Name}</td>
//                 <td>{item.Ring_Name}</td>
//                 <td>{item.Latitude}</td>
//                 <td>{item.Longitude}</td>
//                 <td>{item.OLT_ID}</td>
//                 <td
//                   style={{
//                     color: item.OLT_Status === "up" ? "green" : "red",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {item.OLT_Status}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {duplicateIds.size > 0 && (
//         <p style={{ marginTop: "10px", color: "red" }}>
//           🔴 Highlighted rows indicate duplicate Customer IDs
//         </p>
//       )}
//     </div>
//   );
// };

// export default MergedCustomerOLT;
