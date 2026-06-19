// src/components/CustomersChartCard.jsx

import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa'; // Icon for customers

// 💡 Import Recharts components for a Bar Chart
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ⬅️ Use environment variable for the base URL
const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
// Assuming the API endpoint is: http://localhost:5000/api/n_customers
const CUSTOMERS_API_URL = `${API_BASE_URL}/n_customers`; 

/**
 * Chart Card 2 (Bottom-Right or Middle) - Shows OLT_Name-wise Customer Count as a Bar Chart.
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
          // --- Data Aggregation Logic: Count Customers by OLT_Name ---
          const customersByOLT_Name = data.reduce((acc, item) => {
            // Normalize OLT_Name name
            const OLT_Name = (item.OLT_Name || 'Unknown OLT_Name').trim();
            
            // Skip invalid cities
            if (!OLT_Name) return acc;
            
            if (!acc[OLT_Name]) {
              acc[OLT_Name] = 0;
            }
            // Each item is one customer record, so we increment the count
            acc[OLT_Name] += 1; 
            return acc;
          }, {});

          // Convert aggregated object to array format for charting
          const finalChartData = Object.keys(customersByOLT_Name)
            .map(OLT_Name => ({
              OLT_Name: OLT_Name,
              // Total count of records (customers)
              customerCount: customersByOLT_Name[OLT_Name], 
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
  const renderChart = () => {
    if (isLoading) return <div>Loading Data...</div>;
    if (error) return <div style={errorStyle}>{error}</div>;
    if (chartData.length === 0) return <div>No Customer Data Available.</div>;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          // Adjust margins for labels
          margin={{ top: 15, right: 10, left: -20, bottom: 5 }} 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a456e" />
          <XAxis dataKey="OLT_Name" stroke="#9ca5b3" />
          <YAxis 
            stroke="#9ca5b3" 
            label={{ value: 'Customers', angle: -90, position: 'insideLeft', fill: '#00c2ff' }} 
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#07162a', border: '1px solid #00c2ff' }}
            formatter={(value) => [value.toLocaleString(), 'Customers']} 
            labelFormatter={(label) => `OLT_Name: ${label}`}
          />
          <Legend wrapperStyle={{ paddingTop: '10px', color: '#e0e0e0' }} />
          <Bar 
            dataKey="customerCount" 
            name="Customer Count" 
            fill="#ff7f50" // A distinct color for the bars (e.g., coral/orange)
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div style={cardStyle}>
        {/* HEADER SECTION */}
        <div style={headerStyle}>
          <FaUsers style={iconStyle} /> 
          <div style={titleStyle}>Customer Count by Node</div>
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