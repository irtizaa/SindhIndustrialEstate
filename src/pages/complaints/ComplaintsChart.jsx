import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

      const nodeCount = {};

      apiData.forEach((item) => {
        const node = item?.OLT || "Unknown";
        nodeCount[node] = (nodeCount[node] || 0) + 1;
      });

      const formatted = Object.keys(nodeCount)
        .map((node) => ({
          name: node,
          size: nodeCount[node],
        }))
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

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
      <h3 style={titleStyle}>Top 10 OLTs with Highest Complaints</h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{  bottom: 40 }}
        >
          <CartesianGrid stroke="#0f2a4d" />
          <XAxis
            dataKey="name"
            stroke="#ffffff"
            angle={-20}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 10 }}  // <-- reduced text size here
          />
          <YAxis stroke="#ffffff" />
          <Tooltip
            contentStyle={{
              background: "#0F2A4D",
              border: "1px solid #1e90ff",
              color: "#fff",
            }}
            formatter={tooltipFormatter}
          />
          <Bar dataKey="size" fill="#1e90ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}