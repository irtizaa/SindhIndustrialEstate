// src/components/nodesCountCard.jsx

import React, { useState, useEffect } from 'react';
// import { TextAlignCenter } from 'lucide-react'; // Not used in the final JSX
import { FaPlug } from 'react-icons/fa'; // Using a relevant icon

// ⬅️ Use environment variable for the base URL
const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
const NODES_API_URL = `${API_BASE_URL}/n_nodes`;

/**
 * Main Stat Card 1 (Top-Left-Top) - Counts the total number of Nodes.
 */
export default function NodesCountCard() {
  const [nodesCount, setNodesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNodesCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(NODES_API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // 💡 The count is simply the length of the array response
          setNodesCount(data.length); 
        } else {
          throw new Error("API response is not an array.");
        }
      } catch (e) {
        console.error("Error fetching Nodes data:", e);
        setError("Failed to load Nodes data. Check network/API.");
        setNodesCount(0); // Reset count on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodesCount();
  }, []); // Empty dependency array means this runs once on mount

  // --- STYLING ---
  // Using inline styles for simplicity, mimicking the dark mode look.

  const cardStyle = {
    backgroundColor: "var(--card-bg, #07162a)", // Defaulting to dark blue
    border: "1px solid var(--border-color, #1b3a63)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
    height: "100%",
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    fontFamily: 'Arial, sans-serif'
  };
  
  const titleContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#fdd835', // Yellow icon color
    marginBottom: '4px',
  };

  const titleStyle = {
    color: '#00c2ff', // Bright blue for the title
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
  };

  // ⬅️ NEW DIVIDER STYLE
  const dividerStyle = {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Light gray/white with transparency
    margin: '10px 0', // Vertical spacing for separation
  };

  const countStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#00e5ff', // Lighter blue for the number
    marginTop: '10px',
  };
  
  const errorStyle = { 
      color: '#ff4d4d', 
      fontSize: '14px',
      marginTop: '10px'
  };


  return (
    <div style={cardStyle}>
        
        {/* TOP SECTION: ICON & HEADING */}
        <div style={titleContainerStyle}>
          {/* <FaPlug style={iconStyle} /> */}
          <div style={titleStyle}>Total OLTs</div>
        </div>
        
        {/* ⬅️ DIVIDER */}
        <div style={dividerStyle} />
        
        {/* BOTTOM SECTION: COUNT / STATUS */}
        {isLoading && <div style={countStyle}>...</div>}
        {error && <div style={errorStyle}>{error}</div>}
        {!isLoading && !error && (
          <div style={countStyle}>{nodesCount.toLocaleString()}</div>
        )}
        
    </div>
  );
}