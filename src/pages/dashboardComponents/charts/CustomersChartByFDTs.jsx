// src/components/CustomersChartCard.jsx

import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa'; // Icon for customers
// 💡 Import Recharts components for a Bar Chart
import {
   Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,Treemap, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ⬅️ Use environment variable for the base URL
const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
// Assuming the API endpoint is: http://localhost:5000/api/n_customers
const CUSTOMERS_API_URL = `${API_BASE_URL}/n_customers`; 

/**
 * Chart Card 2 (Bottom-Right or Middle) - Shows FDT_PON_Splitter_ID-wise Customer Count as a Bar Chart.
 */
export default function CustomersChartCard() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(CUSTOMERS_API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // --- Data Aggregation Logic: Count Customers by FDT_PON_Splitter_ID ---
          const customersByFDT_PON_Splitter_ID = data.reduce((acc, item) => {
            // Normalize FDT_PON_Splitter_ID name
            const FDT_PON_Splitter_ID = (item.FDT_PON_Splitter_ID || 'Unknown FDT_PON_Splitter_ID').trim();
            
            // Skip invalid cities
            if (!FDT_PON_Splitter_ID) return acc;
            
            if (!acc[FDT_PON_Splitter_ID]) {
              acc[FDT_PON_Splitter_ID] = 0;
            }
            // Each item is one customer record, so we increment the count
            acc[FDT_PON_Splitter_ID] += 1; 
            return acc;
          }, {});

          // Convert aggregated object to array format for charting
          const finalChartData = Object.keys(customersByFDT_PON_Splitter_ID)
            .map(FDT_PON_Splitter_ID => ({
              FDT_PON_Splitter_ID: FDT_PON_Splitter_ID,
              // Total count of records (customers)
              customerCount: customersByFDT_PON_Splitter_ID[FDT_PON_Splitter_ID], 
            }))
            // Sort data by count (descending)
            .sort((a, b) => b.customerCount - a.customerCount); 

          setChartData(finalChartData);
        } else {
          throw new Error("API response is not an array (expected a list of customer records).");
        }
      } catch (e) {
        console.error("Error fetching/processing customer data:", e);
        setError("Failed to load customer data. Check network/API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  // --- STYLING (Consistent Dark Mode Styling) ---

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

  // Ensures chart takes all available vertical space
  const chartContainerStyle = {
    flexGrow: 1, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    minHeight: '200px', 
  };
  
  const errorStyle = { 
      color: '#ff4d4d', 
      fontSize: '14px',
      textAlign: 'center'
  };

  // --- CHART RENDERING (Bar Chart) ---
// --- CHART RENDERING (Radar Chart without axis labels) ---
const renderChart = () => {
  if (isLoading) return <div>Loading Data...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;
  if (chartData.length === 0) return <div>No Customer Data Available.</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
        {/* Grid for visual reference */}
        <PolarGrid stroke="#2a456e" />

        {/* Remove axis labels by not specifying a tick renderer */}
        <PolarAngleAxis 
          dataKey="FDT_PON_Splitter_ID" 
          tick={false}  // Hide axis labels
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, Math.max(...chartData.map(d => d.customerCount))]} 
          tick={false} // Hide radius labels
        />

        <Radar 
          name="Customer Count" 
          dataKey="customerCount" 
          stroke="#fb4909ff" 
          fill="#ff7f50" 
          fillOpacity={0.6} 
        />

        <Tooltip 
          contentStyle={{ backgroundColor: '#204371ff', border: '1px solid #00c2ff' }}
          formatter={(value) => [`${value.toLocaleString()}`, 'Customers']}
          labelFormatter={(label) => `FDT ID: ${label}`}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};


  return (
    <div style={cardStyle}>
        {/* HEADER SECTION */}
        <div style={headerStyle}>
          <FaUsers style={iconStyle} /> 
          <div style={titleStyle}>Customer Count by FDTs</div>
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