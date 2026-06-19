// src/components/MetroFiberChartCard.jsx

import React, { useState, useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';

// 💡 Import Recharts components
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
const FIBER_API_URL = `${API_BASE_URL}/n_metroFiber`;
const METERS_TO_KM = 0.001;

/**
 * Chart Card 1 (Bottom-Left) - Shows city-wise Core Network length as a Horizontal Bar Chart, 
 * broken down by Connectivity_Type (Aerial/Buried).
 */
export default function MetroFiberChartCard() {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    // 🛑 KEY CHANGE 1: Restructure the accumulator to track Aerial and Buried lengths
                    const totalLengthByCity = data.reduce((acc, item) => {
                        const city = (item.City || 'Unknown City').trim();
                        const length = parseFloat(item.Calculated_Length);
                        const type = (item.Connectivity_Type === 'Aerial' || item.Connectivity_Type === 'Buried')
                            ? item.Connectivity_Type // Use 'Aerial' or 'Buried'
                            : 'Other'; // Group unknown/other types

                        if (!city || isNaN(length) || length <= 0) return acc;

                        if (!acc[city]) {
                            acc[city] = { Aerial: 0, Buried: 0, Other: 0 };
                        }
                        acc[city][type] += length;
                        return acc;
                    }, {});

                    const finalChartData = Object.keys(totalLengthByCity)
                        .map(city => ({
                            city: city,
                            // Convert all properties to KM and round
                            Aerial: Math.round(totalLengthByCity[city].Aerial * METERS_TO_KM * 100) / 100,
                            Buried: Math.round(totalLengthByCity[city].Buried * METERS_TO_KM * 100) / 100,
                            // Calculate total for sorting
                            totalLength: totalLengthByCity[city].Aerial + totalLengthByCity[city].Buried + totalLengthByCity[city].Other,
                        }))
                        // Sort by the overall total length (descending)
                        .sort((a, b) => b.totalLength - a.totalLength);

                    setChartData(finalChartData);
                } else {
                    throw new Error("API response is not an array.");
                }
            } catch (e) {
                console.error("Error fetching/processing fiber data:", e);
                setError("Failed to load chart data. Check network/API.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndProcessData();
    }, []);

    // --- STYLING (Unchanged) ---
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
        minHeight: '200px',
    };

    const errorStyle = { color: '#ff4d4f', textAlign: 'center' };

    // --- CHART RENDERING (Horizontal Stacked Bar Chart) ---
    const renderChart = () => {
        if (isLoading) return <div style={chartContainerStyle}>Loading Data...</div>;
        if (error) return <div style={{ ...chartContainerStyle, ...errorStyle }}>{error}</div>;
        if (chartData.length === 0) return <div style={chartContainerStyle}>No Fiber Length Data Available.</div>;

        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    // Layout remains vertical for horizontal bars
                    layout="vertical"
                    margin={{ top: 15, right: 30, left: 25, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a456e" />

                    {/* YAxis now handles the CATEGORIES (Cities) */}
                    <YAxis
                        dataKey="city"
                        type="category"
                        stroke="#9ca5b3"
                    />

                    {/* XAxis now handles the NUMERICAL VALUES (Length in KM) */}
                    <XAxis
                        type="number"
                        stroke="#9ca5b3"
                        label={{ value: 'Length (KM)', position: 'insideBottomRight', offset: 0, fill: '#00c2ff' }}
                        tickFormatter={(value) => value.toLocaleString()}
                    />

                    <Tooltip
                        contentStyle={{ backgroundColor: '#07162a', border: '1px solid #00c2ff' }}
                        // Display both Aerial and Buried lengths in the tooltip
                        formatter={(value, name) => [`${value.toLocaleString()} KM`, name]}
                        labelFormatter={(label) => `City: ${label}`}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', color: '#e0e0e0' }} />

                    {/* 🛑 KEY CHANGE 2: Add two <Bar> components and set stackId */}
                    <Bar
                        dataKey="Aerial"
                        name="Aerial Fiber (KM)"
                        fill="rgba(0, 255, 94, 1)" // Light blue for Aerial
                        stackId="a" // Identical stackId makes them stack horizontally
                    />
                    <Bar
                        dataKey="Buried"
                        name="Buried Fiber (KM)"
                        fill="#00e5ff" // Yellow/Gold for Buried
                        stackId="a" // Identical stackId makes them stack horizontally
                    />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div style={cardStyle}>
            {/* HEADER SECTION */}
            <div style={headerStyle}>
                <FaChartBar style={iconStyle} />
                <div style={titleStyle}>Optix Fiber Length by City (Aerial & Buried)</div>
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