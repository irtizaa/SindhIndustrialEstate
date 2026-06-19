
import React, { useState, useEffect } from 'react';

// import { TextAlignCenter } from 'lucide-react'; // Not used in the final JSX

import { FaPlug } from 'react-icons/fa'; // Using a relevant icon



// ⬅️ Use environment variable for the base URL

const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;

const HH_API_URL = `${API_BASE_URL}/n_handholes`;



/**

 * Main Stat Card 1 (Top-Left-Top) - Counts the total number of HH.

 */

export default function HHCountCard() {

  const [HHCount, setHHCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    const fetchHHCount = async () => {

      setIsLoading(true);

      setError(null);

      try {

        const response = await fetch(HH_API_URL);

       

        if (!response.ok) {

          throw new Error(`HTTP error! status: ${response.status}`);

        }

       

        const data = await response.json();

       

        if (Array.isArray(data)) {

          // 💡 The count is simply the length of the array response

          setHHCount(data.length);

        } else {

          throw new Error("API response is not an array.");

        }

      } catch (e) {

        console.error("Error fetching HH data:", e);

        setError("Failed to load joint data. Check network/API.");

        setHHCount(0); // Reset count on error

      } finally {

        setIsLoading(false);

      }

    };



    fetchHHCount();

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

          <div style={titleStyle}>Total Handholes</div>

        </div>

       

        {/* ⬅️ DIVIDER */}

        <div style={dividerStyle} />

       

        {/* BOTTOM SECTION: COUNT / STATUS */}

        {isLoading && <div style={countStyle}>...</div>}

        {error && <div style={errorStyle}>{error}</div>}

        {!isLoading && !error && (

          <div style={countStyle}>{HHCount.toLocaleString()}</div>

        )}

       

    </div>

  );

}