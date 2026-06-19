// Working good for straight route

import React, { useState, useEffect, useRef } from "react";

const CustomerToOLTRouteWidget = ({ map }) => {
  const [customers, setCustomers] = useState([]);
  const [olts, setOlts] = useState([]);
  const [fibers, setFibers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [routeStats, setRouteStats] = useState(null); // To store length and info
  const [isVisible, setIsVisible] = useState(true);

  const routePolylinesRef = useRef([]);
  const markersRef = useRef([]);

  // 1. Fetch all required APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, oltRes, fiberRes] = await Promise.all([
          fetch("http://localhost:5000/api/n_customers"),
          fetch("http://localhost:5000/api/n_nodes"),
          fetch("http://localhost:5000/api/n_metrofiber"),                                                      
        ]);

        setCustomers(await custRes.json());
        setOlts(await oltRes.json());
        setFibers(await fiberRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Clear Map Objects
const clearRoute = () => {
    routePolylinesRef.current.forEach((obj) => {
      if (obj.setMap) obj.setMap(null); // Works for Polylines
      if (obj.setDirections) obj.setDirections({ routes: [] }); // Clears DirectionsRenderer
    });
    markersRef.current.forEach((m) => m.setMap(null));
    routePolylinesRef.current = [];
    markersRef.current = [];
    setRouteStats(null);
  };
                                                                                                                              
  // 3. Routing and Drawing Logic                                                                                                                                            
 const handleTraceRoute = (customer) => {                                                                       
    if (!map) return;

    // 1. Clear previous drawings
    clearRoute();
    setSearchQuery("");
    setFilteredCustomers([]);

    // 2. Locate the specific OLT
    const targetOlt = olts.find((o) => 
      String(o.OLT_ID).trim() === String(customer.OLT_ID).trim()
    );

    if (!targetOlt) {
      alert(`OLT ID ${customer.OLT_ID} not found in nodes database.`);
      return;
    }

    // 3. Initialize Google Directions Services
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // We will use our own custom markers
      polylineOptions: {
        strokeColor: "#FFFF00", // Your Yellow Theme
        strokeWeight: 6,
        zIndex: 9999
      }
    });

    // Store the renderer so we can clear it later
    routePolylinesRef.current.push(directionsRenderer);

    // 4. Create the Route Request
    const request = {
      origin: { lat: parseFloat(targetOlt.Latitude), lng: parseFloat(targetOlt.Longitude) },
      destination: { lat: parseFloat(customer.Latitude), lng: parseFloat(customer.Longitude) },
      travelMode: window.google.maps.TravelMode.DRIVING, // This forces it to follow roads
    };

    // 5. Execute Routing
    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);

        // Extract real road distance from the result
        const routeData = result.routes[0].legs[0];
        setRouteStats({
          customerName: customer.Customer_Name,
          oltName: targetOlt.OLT_Name,
          length: routeData.distance.text, // "2.5 km" instead of raw meters
          duration: routeData.duration.text,
          segmentCount: routeData.steps.length
        });

        // 6. Add Custom Markers at the road-snapped ends
        const addMarker = (position, title, color) => {
          const marker = new window.google.maps.Marker({
            position,
            map,
            title,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: color,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            },
          });
          markersRef.current.push(marker);
        };

        addMarker(routeData.start_location, "OLT Source", "#FF0000");
        addMarker(routeData.end_location, "Customer", "#00FF00");

      } else {
        alert("Directions request failed: " + status);
      }
    });
  };                       
                                                                                                                                                                                
  // Search filter logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = customers.filter(c => 
        c.Customer_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.Customer_ID?.toString().includes(searchQuery)
      );
      setFilteredCustomers(filtered.slice(0, 8));
    } else {
      setFilteredCustomers([]);
    }
  }, [searchQuery, customers]);

  return (
    <div style={widgetStyle}>
      <div style={headerStyle}>
        <span>🔀 Fiber Route Tracer</span>
        <button onClick={() => setIsVisible(!isVisible)} style={toggleBtn}>
          {isVisible ? "−" : "+"}
        </button>
      </div>

      {isVisible && (
        <div style={contentStyle}>
          <input
            type="text"
            placeholder="Enter Customer Name/ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
          />

          {filteredCustomers.length > 0 && (
            <div style={resultsContainer}>
              {filteredCustomers.map((c) => (
                <div key={c.Customer_ID} onClick={() => handleTraceRoute(c)} style={resultItem}>
                  {c.Customer_Name} <small style={{color:'#00C2FF'}}>({c.Customer_ID})</small>
                </div>
              ))}
            </div>
          )}

          {routeStats && (
            <div style={statsBox}>
              <div style={statRow}>
                <span style={label}>Total Length:</span>
                <span style={value}>{routeStats.length.toLocaleString()} Meters</span>
              </div>
              <div style={statRow}>
                <span style={label}>Ring Name:</span>
                <span style={value}>{routeStats.ring}</span>
              </div>
              <div style={statRow}>
                <span style={label}>Segments:</span>
                <span style={value}>{routeStats.segmentCount} Fiber Links</span>
              </div>
              
                <div style={statRow}>
                <span style={label}>Customer_Name:</span>
                <span style={value}>{routeStats.Customer_Name} Customer_Name</span>
              </div>
              <div style={{fontSize: '11px', marginTop: '8px', color: '#FFFF00', textAlign:'center'}}>
                Route displayed in Yellow on map
              </div>
            </div>
          )}

          <button onClick={clearRoute} style={clearBtn}>Clear Map</button>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const widgetStyle = {
  position: "absolute", top: "150px", right: "50px", width: "300px",
  backgroundColor: "rgba(10, 25, 47, 0.95)", color: "white", borderRadius: "8px",
  zIndex: 1000, border: "1px solid #1B3A63", boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
  fontFamily: "sans-serif"
};

const headerStyle = {
  padding: "10px 15px", background: "#1B3A63", borderRadius: "8px 8px 0 0",
  display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "14px"
};

const contentStyle = { padding: "15px" };

const inputStyle = {
  width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #30475E",
  backgroundColor: "#0A192F", color: "white", marginBottom: "5px"
};

const resultsContainer = {
  backgroundColor: "#162447", borderRadius: "4px", maxHeight: "150px", overflowY: "auto", marginBottom: "10px"
};

const resultItem = {
  padding: "8px", cursor: "pointer", borderBottom: "1px solid #1B3A63", fontSize: "13px"
};

const statsBox = {
  background: "rgba(255, 255, 255, 0.05)", padding: "10px", borderRadius: "6px",
  marginBottom: "10px", borderLeft: "4px solid #FFFF00"
};

const statRow = { display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" };
const label = { color: "#aaa" };
const value = { fontWeight: "bold", color: "#fff" };

const clearBtn = {
  width: "100%", padding: "8px", background: "#E43F5A", color: "white",
  border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"
};

const toggleBtn = { background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px" };

export default CustomerToOLTRouteWidget;