// src/components/CityFiberChartCard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FaGlobeAsia } from 'react-icons/fa'; 

// 💡 Import Recharts components for a Pie Chart
import {
  PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell, Sector
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
const FIBER_API_URL = `${API_BASE_URL}/n_metroFiber`;
const METERS_TO_KM = 0.001;

// Define a richer, more vibrant color palette for the Pie Chart slices
const COLORS = [
  '#8884d8', // Purple
  '#82ca9d', // Light Green
  '#ffc658', // Yellow
  '#FF8042', // Orange
  '#00C49F', // Teal
  '#0088FE', // Blue
  '#A020F0', // Deeper Purple
  '#DC143C'  // Crimson
];

/**
 * Chart Card 3 - Shows City-wise Core Network length as a Pie Chart.
 */
export default function CityFiberChartCard() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // For active slice hover effect

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);                                                                     
      setError(null);
      try {
        const response = await fetch(FIBER_API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const totalLengthByCity = data.reduce((acc, item) => {
            const City = (item.City || 'Unknown City').trim();
            const length = parseFloat(item.Calculated_Length);
            
            if (!City || isNaN(length) || length <= 0) return acc;
            
            if (!acc[City]) {
              acc[City] = 0;
            }
            acc[City] += length;
            return acc;
          }, {});

          const finalChartData = Object.keys(totalLengthByCity)
            .map(City => ({
              name: City,
              value: Math.round(totalLengthByCity[City] * METERS_TO_KM * 100) / 100,
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value); // Sort by value for better visual impact

          setChartData(finalChartData);
        } else {
          throw new Error("API response is not an array.");
        }
      } catch (e) {
        console.error("Error fetching/processing fiber data:", e);
        setError("Failed to load City data. Check network/API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  // Custom Shape for the active segment on hover
  const renderActiveShape = useCallback((props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{ fontWeight: 'bold' }}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10} // Make active slice slightly larger
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff" // White stroke for active slice
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="none"
        />
      </g>
    );
  }, []);

  // Event handler for pie slice hover
  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;

      return (
        <div style={{
          backgroundColor: '#1a2a3a', // Darker background for tooltip
          border: '1px solid #00c2ff', // Border color
          padding: '10px',
          borderRadius: '5px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          <p className="label" style={{ color: COLORS[payload[0].index % COLORS.length] }}>
            {`${data.name}: ${data.value.toLocaleString()} KM`}
          </p>
          <p className="intro">{`Percentage: ${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // --- STYLING (Consistent Dark Mode Styling, mostly unchanged) ---

  const cardStyle = {
    backgroundColor: "var(--card-bg, #07162a)",
    border: "1px solid var(--border-color, #1b3a63)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
    height: "100%",
    display: "flex",
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  };
  
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const iconStyle = {
    fontSize: '20px',
    color: '#fdd835', 
    marginRight: '8px',
  };

  const titleStyle = {
    color: '#00c2ff', 
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  };

  const dividerStyle = {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    margin: '10px 0',
  };

  const chartContainerStyle = {
    flexGrow: 1, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    minHeight: '250px', 
  };
  
  const errorStyle = { 
      color: '#ff4d4d', 
      fontSize: '14px',
      textAlign: 'center'
  };

  // --- CHART RENDERING (Enhanced Pie Chart) ---
  const renderChart = () => {
    if (isLoading) return <div>Loading Data...</div>;
    if (error) return <div style={errorStyle}>{error}</div>;
    if (chartData.length === 0) return <div>No Cityal Fiber Data Available.</div>;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={chartData}
            dataKey="value" 
            nameKey="name"  
            cx="50%"
            cy="50%"
            innerRadius={60} // Donut chart effect
            outerRadius={90} // Outer radius
            fill="#8884d8"
            // labelLine={false} // Hiding default label lines
            // label={renderCustomizedLabel} // Using custom label (can be enabled if needed)
            activeIndex={activeIndex} // Connects to hover state
            activeShape={renderActiveShape} // Custom shape on hover
            onMouseEnter={onPieEnter} // Event handler for hover
            paddingAngle={2} // Small gap between slices
            stroke="rgba(0,0,0,0.5)" // Subtle dark stroke between slices
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                // stroke={COLORS[index % COLORS.length]} // Can add stroke for depth
                // strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            content={<CustomTooltip />} // Use the custom tooltip component
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px', color: '#e0e0e0' }} 
            layout="horizontal" 
            align="center"
            verticalAlign="bottom"
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div style={cardStyle}>
        {/* HEADER SECTION */}
        <div style={headerStyle}>
          <FaGlobeAsia style={iconStyle} /> 
          <div style={titleStyle}>Core Network Length by City</div>
        </div>
        
        {/* DIVIDER */}
        <div style={dividerStyle} />
        
        {/* CHART AREA */}
        <div style={chartContainerStyle}>
          {renderChart()}
        </div>
        
    </div>
  );
}