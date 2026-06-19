// src/components/customersCountCard.jsx

import React, { useState, useEffect } from 'react';
// import { TextAlignCenter } from 'lucide-react'; // Not used in the final JSX
import { FaPlug } from 'react-icons/fa'; // Using a relevant icon

// ⬅️ Use environment variable for the base URL
const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
const CUSTOMERS_API_URL = `${API_BASE_URL}/n_customers`;

/**
 * Main Stat Card 1 (Top-Left-Top) - Counts the total number of customers.
 */
export default function CustomersCountCard() {
  const [customersCount, setCustomersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
                                                                                                                                                                                                  
  useEffect(() => {
    const fetchCustomersCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(CUSTOMERS_API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();   
        
        if (Array.isArray(data)) {
          // 💡 The count is simply the length of the array response
          setCustomersCount(data.length); 
        } else {
          throw new Error("API response is not an array.");
        }
      } catch (e) {
        console.error("Error fetching customers data:", e);
        setError("Failed to load customers data. Check network/API.");
        setCustomersCount(0); // Reset count on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomersCount();
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
          <div style={titleStyle}>Total Customers</div>
        </div>
        
        {/* ⬅️ DIVIDER */}
        <div style={dividerStyle} />
        
        {/* BOTTOM SECTION: COUNT / STATUS */}
        {isLoading && <div style={countStyle}>...</div>}
        {error && <div style={errorStyle}>{error}</div>}
        {!isLoading && !error && (
          <div style={countStyle}>{customersCount.toLocaleString()}</div>
        )}
        
    </div>
  );
}


// customers with GIS customers + SmartOLT (olt status counts in tooltip on hover over count number (online, offline, power fail, LOS, null))

// import React, { useState, useEffect } from "react";

// // API
// const CUSTOMERS_API_URL = "http://localhost:4000/api/merged_customers_olt";

// const OLT_STATUSES = ["Online", "Offline", "Power fail", "LOS", "null"];

// const EMPTY_STATUS_COUNT = {
//   Online: 0,
//   Offline: 0,
//   "Power fail": 0,
//   LOS: 0,
//   null: 0,
// };

// export default function CustomersCountCard() {
//   const [customersCount, setCustomersCount] = useState(0);
//   const [oltStatusCount, setOltStatusCount] = useState(EMPTY_STATUS_COUNT);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showTooltip, setShowTooltip] = useState(false);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const res = await fetch(CUSTOMERS_API_URL);
//         if (!res.ok) throw new Error("API error");

//         const result = await res.json();
//         const data = Array.isArray(result.data) ? result.data : [];

//         setCustomersCount(result.matched ?? data.length);

//         const statusCount = { ...EMPTY_STATUS_COUNT };

//         data.forEach(item => {
//           const status = item?.OLT_Status ?? "null";

//           if (statusCount.hasOwnProperty(status)) {
//             statusCount[status]++;
//           } else {
//             statusCount.null++;
//           }
//         });

//         setOltStatusCount(statusCount);

//       } catch (e) {
//         console.error(e);
//         setError("Failed to load customers");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   // ---------------- STYLES ----------------

//   const cardStyle = {
//     backgroundColor: "var(--card-bg, #07162a)",
//     border: "1px solid var(--border-color, #1b3a63)",
//     borderRadius: "12px",
//     padding: "20px",
//     boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "Arial, sans-serif",
//     position: "relative"
//   };

//   const titleStyle = {
//     color: "#00c2ff",
//     fontSize: "16px",
//     fontWeight: 600,
//   };

//   const countStyle = {
//     fontSize: "36px",
//     fontWeight: "bold",
//     color: "#00e5ff",
//     cursor: "pointer",
//   };

//   const tooltipStyle = {
//     position: "absolute",
//     bottom: "1%",
//     backgroundColor: "#0b2545",
//     border: "1px solid #1b3a63",
//     borderRadius: "8px",
//     padding: "10px 14px",
//     color: "#fff",
//     fontSize: "13px",
//     minWidth: "180px",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
//     zIndex: 10,
//   };

//   const rowStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "4px",
//   };

//   return (
//     <div style={cardStyle}>
//       <div style={{ marginBottom: 8 }}>
//         <div style={titleStyle}>Total Customers</div>
//       </div>

//       {isLoading && <div style={countStyle}>...</div>}
//       {error && <div style={{ color: "#ff4d4d" }}>{error}</div>}

//       {!isLoading && !error && (
//         <div
//           style={{ display: "flex", alignItems: "center" }}
//           onMouseEnter={() => setShowTooltip(true)}
//           onMouseLeave={() => setShowTooltip(false)}
//         >
//           <div style={countStyle}>
//             {customersCount.toLocaleString()}
//           </div>

//           {showTooltip && (
//             <div style={tooltipStyle}>
//              {OLT_STATUSES.map(status => (
//   <div key={status} style={rowStyle}>
//     <span>{status}</span>
//     <strong>{oltStatusCount[status]}</strong>
//   </div>
// ))}


//               <hr style={{ borderColor: "#1b3a63", margin: "6px 0" }} />

//               <div style={rowStyle}>
//                 <span>Total</span>
//                 <strong>{customersCount.toLocaleString()}</strong>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
