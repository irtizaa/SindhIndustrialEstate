// import React, { useEffect, useState } from "react";
// import {
//   RadialBarChart,
//   RadialBar,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function ComplaintAgingRadialChart() {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => { fetchData(); }, []);

//   const fetchData = async () => {
//     try {
//       const res = await fetch("http://localhost:2000/");
//       const data = await res.json();

//       const buckets = {                                                                         
//         "0-1 Days": 0,
//         "2-3 Days": 0,
//         "4-7 Days": 0,
//         "8-14 Days": 0,
//         "15+ Days": 0,
//       };

//       data.forEach((item) => {                                                                  
//         const days = Math.floor(
//           (new Date() - new Date(item.CreatedAt)) / (1000 * 60 * 60 * 24)
//         );

//         if (days <= 1) buckets["0-1 Days"]++;
//         else if (days <= 3) buckets["2-3 Days"]++;
//         else if (days <= 7) buckets["4-7 Days"]++;
//         else if (days <= 14) buckets["8-14 Days"]++;
//         else buckets["15+ Days"]++;
//       });

//       const formattedData = Object.keys(buckets).map((range) => ({
//         name: range,
//         value: buckets[range],
//         fill: getColor(range),
//       }));

//       setChartData(formattedData);
//     } catch (err) {
//       console.error("Error loading:", err);
//     }
//   };

//   const getColor = (range) => {
//     switch (range) {
//       case "0-1 Days": return "#2ecc71";
//       case "2-3 Days": return "#3498db";
//       case "4-7 Days": return "#9b59b6";
//       case "8-14 Days": return "#e67e22";
//       case "15+ Days": return "#e74c3c";
//       default: return "#8884d8";
//     }
//   };
//  const titleStyle = {
//     color: '#00c2ff', // Bright blue for the title
//     fontSize: '16px',
//     fontWeight: '600',
//     textAlign: 'center',
//     margin: 0,
//   };


//   return (
//     <div className="chart-card" style={{ width: "100%", height: 390, backgroundColor:'#07162a' }}>
//        <h3 style={titleStyle}>Complaints Aging (Days) </h3>

//       <ResponsiveContainer width="100%" height="90%">
//         <RadialBarChart innerRadius="10%" outerRadius="80%" data={chartData}>
//           <RadialBar minAngle={5} background clockWise dataKey="value" />                       
//           <Legend  />
//           <Tooltip />
//         </RadialBarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function NodeWiseComplaintTreemap() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:2000/");
      const apiData = await res.json();

      const areaCount = {};

      apiData.forEach((item) => {
        const area = item?.CityName || "Unknown";
        areaCount[area] = (areaCount[area] || 0) + 1;
      });

      // Get top 5 areas by complaint count
      const formatted = Object.keys(areaCount)
        .map((area) => ({
          name: area,
          size: areaCount[area],
        }))
        .sort((a, b) => b.size - a.size)
  // .sort((a, b) => b.size - a.size); // keep sorting but include all
      setChartData(formatted);
    } catch (err) {
      console.error("Error loading area data:", err);
    }
  };

  const colors = ["#ff4d4f", "#1e90ff", "#00c2ff", "#28a745", "#ffc107"];

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
      <h3 style={titleStyle}>City Wise Complaints</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          // margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
          margin={{ left: 47}}
        >
          <CartesianGrid stroke="#0f2a4d" />
          <XAxis type="number" stroke="#ffffff" />
          <YAxis type="category" dataKey="name" stroke="#ffffff" />
          <Tooltip
            contentStyle={{
              background: "#0F2A4D",
              border: "1px solid #1e90ff",
              color: "#fff",
            }}
            formatter={tooltipFormatter}
          />
          <Bar dataKey="size">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}