// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function PriorityComplaintsChart() {
//   const [chartData, setChartData] = useState([]);

//   const COLORS = ["#1bec72ff", "#1c95e5ff", "#e07212ff", "#e74c3c", "#a42bd3ff", "#f1c40f"];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await fetch("http://localhost:2000/");
//       const data = await res.json(); // data is an array of complaint objects

//       const counts = {};
//       data.forEach((item) => {
//         const priority = item?.PriortyName || "Unknown"; // use PriortyName
//         counts[priority] = (counts[priority] || 0) + 1;
//       });

//       const formattedData = Object.keys(counts).map((key) => ({
//         name: key,
//         value: counts[key],
//       }));

//       setChartData(formattedData);
//     } catch (err) {
//       console.error("Error fetching priority data:", err);
//     }
//   };

  
//   const titleStyle = {
//     color: '#00c2ff', // Bright blue for the title
//     fontSize: '16px',
//     fontWeight: '600',
//     textAlign: 'center',
//     margin: 0,
//   };

//   return (
//     <div
//       className="chart-card"
//       style={{
//         width: "100%",
//         height: 390,
//         background: "#07162a",                                                      
//         padding: 8,
//         borderRadius: 12,
//         color: "#fff",
//       }}
//     >
//       <h3 style={titleStyle}>
//         Complaints by Priority
//       </h3>
//       <ResponsiveContainer width="100%" height="90%">
//         <PieChart>
//           <Pie
//             data={chartData}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             fill="#8884d8"
//             label={({ name, percent }) =>
//               `${name}: ${(percent * 100).toFixed(0)}%`
//             }
//           >
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip
//            contentStyle={{ background: "#0F2A4D", border: "2px solid #1e90ff" }}
//             labelStyle={{ color: "#fff" }}
//             formatter={(value, name) => [`${value} Complaints`, name]}
//           />
//           <Legend
//             wrapperStyle={{ color: "#fff", fontSize: 14 }}
//             layout="horizontal"
//             verticalAlign="bottom"
//             align="center"
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

export default function NodeWiseComplaintTreemap() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:2000/");
      const apiData = await res.json();

      const nodeCount = {};

      apiData.forEach((item) => {
        const node = item?.OLT || "Unknown";
        nodeCount[node] = (nodeCount[node] || 0) + 1;
      });

      const formatted = Object.keys(nodeCount).map((node) => ({
        name: node,
        size: nodeCount[node],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Error loading node data:", err);
    }
  };

  const titleStyle = {
    color: "#00c2ff",
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center",
    margin: 0,
  };

  const tooltipFormatter = (value, name, props) => {
    return [`${props.payload.size} Complaints`, props.payload.name];
  };

  return (
    <div
      className="chart-card"
      style={{
        width: "100%",
        height: 390,
        backgroundColor: "#07162a",
        padding: "4px",
        borderRadius: "10px",
      }}
    >
      <h3 style={titleStyle}>OLT Wise Complaints</h3>

      <ResponsiveContainer width="100%" height="90%">
        <Treemap
          data={chartData}
          dataKey="size"
          stroke="#0f2a4d"
          fill="#1e90ff"
          aspectRatio={4 / 3}
        >
          <Tooltip
            contentStyle={{ background: "#0F2A4D", border: "1px solid #1e90ff", color: "#fff" }}
            formatter={tooltipFormatter}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}