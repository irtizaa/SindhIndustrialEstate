import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import complaintIcon from "/images/LOS.png";
import MainLayout from "../../layouts/MainLayout";
import ComplaintsChart from "./ComplaintsChart";
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const COMPLAINTS_API = import.meta.env.VITE_COMPLAINTS;

const KarachiComplaints = () => {
  useEffect(() => {
    const timer = setInterval(fetchComplaints, 60000);
    return () => clearInterval(timer);
  }, []);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const infoRef = useRef(null);

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchKey, setSearchKey] = useState("");
  const [cityCounts, setCityCounts] = useState({});
  const [cityFilter, setCityFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const markerClusterRef = useRef(null);

  useEffect(() => {
    loadGoogleMapsScript(initMap);
    fetchComplaints();
  }, []);

  useEffect(() => {
    renderMarkers(filtered);
  }, [filtered]);

  const loadGoogleMapsScript = (callback) => {
    if (window.google) {
      callback();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}`;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(COMPLAINTS_API);
      const json = await res.json();
      const list = json?.features || [];

      setComplaints(list);
      setFiltered(list);
      updateCityCounts(list);
    } catch (err) {
      console.error("Complaint fetch error:", err);
    }
  };

  const updateCityCounts = (list) => {
    const counts = {};
    list.forEach((c) => {
      const city = c?.properties?.City || "N/A";
      counts[city] = (counts[city] || 0) + 1;
    });
    setCityCounts(counts);
  };

  const initMap = () => {
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 30.3753, lng: 69.3451 },
      zoom: 6,
      gestureHandling: "greedy",
      mapTypeId: "roadmap",
      styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
    });

    infoRef.current = new google.maps.InfoWindow();
  };                                                                                                            

  const renderMarkers = (data) => {
    if (!mapInstance.current) return;

    if (markerClusterRef.current) markerClusterRef.current.clearMarkers();

    const markers = data.map((item) => {
      const [lng, lat] = item?.geometry?.coordinates ?? [];
      const marker = new google.maps.Marker({
        position: { lat, lng },
        complaint: item.properties,
        icon: { url: complaintIcon, scaledSize: new google.maps.Size(30, 30) },
      });
      marker.addListener("click", () => openInfo(marker));
      return marker;
    });

    markerClusterRef.current = new MarkerClusterer({
      map: mapInstance.current,
      markers,
    });
  };

  const openInfo = (marker) => {
    const p = marker.complaint;
    const content = `
      <div style="min-width:260px;font-family:Arial;background:#0F2A4D;color:white;border-radius:12px;padding:14px;border:1px solid #1e90ff;">
        <h3 style="margin:0 0 12px 0;color:#58a6ff;font-size:17px">${p.Customer_Name}</h3>
        <table style="width:100%;font-size:14px">
          <tr><td><b>Customer ID:</b></td><td>${p.Customer_ID}</td></tr>
          <tr><td><b>Ticket No:</b></td><td>${p.TicketNo}</td></tr>
          <tr><td><b>Status:</b></td><td>${p.StatusName}</td></tr>
          <tr><td><b>Type:</b></td><td>${p.ComplainType}</td></tr>
          <tr><td><b>City:</b></td><td>${p.City}</td></tr>
        </table>
      </div>
    `;
            // <button id="navBtn" style="margin-top:12px;padding:8px 16px;background:#1e90ff;border:none;border-radius:6px;color:white;cursor:pointer;">🚗 Navigate</button>

    infoRef.current.setContent(content);
    infoRef.current.open(mapInstance.current, marker);

    google.maps.event.addListenerOnce(infoRef.current, "domready", () => {
      const btn = document.getElementById("navBtn");
      if (btn) {
        btn.onclick = () => {
          const { lat, lng } = marker.getPosition().toJSON();
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
        };
      }
    });
  };

  const handleSearch = (text) => {
    setSearchKey(text);
    applyFilters(text, cityFilter);
  };

  const applyFilters = (text, city) => {
    let data = [...complaints];
    if (city !== "All") data = data.filter((c) => c?.properties?.City === city);
    if (text) {
      data = data.filter((c) => {
        const p = c.properties;
        return (
          p.Customer_Name?.toLowerCase().includes(text.toLowerCase()) ||
          p.TicketNo?.toLowerCase().includes(text.toLowerCase()) ||
          String(p.Customer_ID)?.includes(text)
        );
      });
    }
    setFiltered(data);
  };

  return (
    <>
      <div style={{ display: "flex", height: "55vh", width: "250%" }}>
        {/* SIDEBAR */}
        <div
          style={{
            width: sidebarOpen ? "340px" : "0px",
            background: "rgba(8,18,46,0.95)",
            backdropFilter: "blur(6px)",
            color: "white",
            overflow: "hidden",
            transition: "0.3s",
            borderRight: sidebarOpen ? "1px solid #1e90ff" : "none",
          }}
        >
          {sidebarOpen && (
            <div style={{ padding: "14px" }}>
              {/* All Complaints */}
              <div
                onClick={() => {
                  setCityFilter("All");
                  applyFilters(searchKey, "All");
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: cityFilter === "All" ? "#123673" : "#0b214c",
                  border: cityFilter === "All" ? "1px solid #1e90ff" : "1px solid #1e90ff50",
                  cursor: "pointer",
                  transition: "0.25s",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "15px" }}>All Complaints</span>
                <span style={{ background: "#ff1e31ff", padding: "4px 10px", fontSize: "13px", borderRadius: "8px" }}>
                  {complaints.length}
                </span>
              </div>

              {/* ✅ City Dropdown */}
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  applyFilters(searchKey, e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  background: "#071635",
                  border: "1px solid #1e90ff",
                  color: "white",
                }}
              >
                <option value="All">All Cities</option>
                {Object.keys(cityCounts).map((c) => (
                  <option key={c} value={c}>
                    {c} ({cityCounts[c]})
                  </option>
                ))}
              </select>

              {/* Search */}
              <input
                type="text"
                value={searchKey}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search complaints..."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #1e90ff",
                  marginBottom: "15px",
                  background: "#071635",
                  color: "white",
                }}
              />

              {/* Complaint List */}
              <div style={{ maxHeight: "30vh", overflowY: "auto", paddingRight: 6 }}>
                {filtered.map((c, idx) => {
                  const p = c.properties || {};
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const [lng, lat] = c.geometry.coordinates;
                        mapInstance.current.panTo({ lat, lng });
                        mapInstance.current.setZoom(16);
                      }}
                      style={{
                        padding: 12,
                        marginBottom: 10,
                        borderRadius: 10,
                        background: "#071b33",
                        border: "1px solid rgba(255,255,255,0.03)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#cfe9ff" }}>{p.Customer_Name}</div>
                          <div style={{ fontSize: 12, color: "#9fbfe8" }}>{p.City} — {p.ComplainType}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 15, fontWeight: 750, color: "#ffb74d" }}>{p.TicketNo}</div>
                          <div style={{ fontSize: 14, color: "#a8d0ff" }}>ID: {p.Customer_ID}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          style={{
            position: "fixed",
            left: sidebarOpen ? "auto" : "auto",
            top: "75px",
            zIndex: 9970,
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1px solid #1e90ff",                                                                
            background: "#061833ff",
            color: "white",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          {sidebarOpen ? "«" : "»"}
        </button>

        {/* MAP */}
        <div style={{ flex: 1 }} ref={mapRef} />
      </div>
    </>
  );
};

export default KarachiComplaints;


// Code for Multinet Complaints and Tracking Vehicles

// import { useEffect, useRef, useState } from "react";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import complaintIcon from "/images/complaint.png";
// import MainLayout from "../../layouts/MainLayout";
// import ComplaintsChart from "./ComplaintsChart";
// const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// const COMPLAINTS_API = import.meta.env.VITE_COMPLAINTS;

// const TRACKING_API =
//   "http://124.29.206.118:9999/trasur/SearchFleetsAPI?name=MULTINETPAK&psw=PAK321&search=";

// const KarachiComplaints = () => {
//   useEffect(() => {
//     const timer = setInterval(() => {
//       fetchComplaints();
//       fetchTrackingData();
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);
//   const infoRef = useRef(null);

//   const [complaints, setComplaints] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [selectedVehicle, setSelectedVehicle] = useState(null); // For bottom-left info window

//   const [searchKey, setSearchKey] = useState("");
//   const [cityCounts, setCityCounts] = useState({});
//   const [cityFilter, setCityFilter] = useState("All");
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const markerClusterRef = useRef(null);
//   const vehicleMarkersRef = useRef([]);

//   useEffect(() => {
//     loadGoogleMapsScript(initMap);
//     fetchComplaints();
//     fetchTrackingData();
//   }, []);

//   useEffect(() => {
//     renderMarkers(filtered);
//     renderVehicleMarkers(vehicles);
//   }, [filtered, vehicles]);

//   const loadGoogleMapsScript = (callback) => {
//     if (window.google) {
//       callback();
//       return;
//     }
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}`;
//     script.async = true;
//     script.onload = callback;
//     document.body.appendChild(script);
//   };

//   // ------------------- EXISTING COMPLAINTS API -------------------
//   const fetchComplaints = async () => {
//     try {
//       const res = await fetch(COMPLAINTS_API);
//       const json = await res.json();
//       const list = json?.features || [];

//       setComplaints(list);
//       setFiltered(list);
//       updateCityCounts(list);
//     } catch (err) {
//       console.error("Complaint fetch error:", err);
//     }
//   };

//   const updateCityCounts = (list) => {
//     const counts = {};
//     list.forEach((c) => {
//       const city = c?.properties?.City || "N/A";
//       counts[city] = (counts[city] || 0) + 1;
//     });
//     setCityCounts(counts);
//   };

//   // ------------------- NEW TRACKING API -------------------
//   const fetchTrackingData = async () => {
//     try {
//       const res = await fetch(TRACKING_API);
//       const json = await res.json();
//       const list = json?.searchResult || [];

//       const formatted = list.map((v) => ({
//         regNo: v.regNo,
//         clientName: v.clientName,
//         speed: v.speed,
//         statusName: v.statusName,
//         location: v.location,
//         odometer: v.current_odometer,
//         eventDate: v.eventDate,
//         lat: v.latitude,
//         lng: v.longitude,
//       }));

//       setVehicles(formatted);
//     } catch (err) {
//       console.error("Tracking API error:", err);
//     }
//   };

//   // ------------------- MAP INITIALIZATION -------------------
//   const initMap = () => {
//     mapInstance.current = new google.maps.Map(mapRef.current, {
//       center: { lat: 30.3753, lng: 69.3451 },
//       zoom: 6,
//       gestureHandling: "greedy",
//       mapTypeId: "roadmap",
//       styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
//     });

//     infoRef.current = new google.maps.InfoWindow();
//   };

//   // ------------------- COMPLAINT MARKERS -------------------
//   const renderMarkers = (data) => {
//     if (!mapInstance.current) return;
//     if (markerClusterRef.current) markerClusterRef.current.clearMarkers();

//     const markers = data.map((item) => {
//       const [lng, lat] = item?.geometry?.coordinates ?? [];
//       const marker = new google.maps.Marker({
//         position: { lat, lng },
//         complaint: item.properties,
//         icon: { url: complaintIcon, scaledSize: new google.maps.Size(30, 30) },
//       });
//       marker.addListener("click", () => openComplaintInfo(marker));
//       return marker;
//     });

//     markerClusterRef.current = new MarkerClusterer({
//       map: mapInstance.current,
//       markers,
//     });
//   };

//   // ------------------- VEHICLE MARKERS -------------------
//   const renderVehicleMarkers = (list) => {
//     if (!mapInstance.current) return;

//     vehicleMarkersRef.current.forEach((m) => m.setMap(null));

//     // ✅ Car icon instead of truck
//     const iconUrl = "https://maps.google.com/mapfiles/kml/shapes/cabs.png";

//     const newMarkers = list
//       .map((v) => {
//         if (!v.lat || !v.lng) return null;
//         const marker = new google.maps.Marker({
//           position: { lat: v.lat, lng: v.lng },
//           map: mapInstance.current,
//           icon: { url: iconUrl, scaledSize: new google.maps.Size(36, 36) },
//           vehicle: v,
//         });

//         marker.addListener("click", () => {
//           setSelectedVehicle(v); // open fixed info window
//         });
//         return marker;
//       })
//       .filter(Boolean);

//     vehicleMarkersRef.current = newMarkers;
//   };

//   // ------------------- INFO WINDOWS -------------------
//   const openComplaintInfo = (marker) => {
//     const p = marker.complaint;
//     const content = `
//       <div style="min-width:260px;font-family:Arial;background:#0F2A4D;color:white;border-radius:12px;padding:14px;border:1px solid #1e90ff;">
//         <h3 style="margin:0 0 12px 0;color:#58a6ff;font-size:17px">${p.Customer_Name}</h3>
//         <table style="width:100%;font-size:14px">
//           <tr><td><b>Customer ID:</b></td><td>${p.Customer_ID}</td></tr>
//           <tr><td><b>Ticket No:</b></td><td>${p.TicketNo}</td></tr>
//           <tr><td><b>Status:</b></td><td>${p.StatusName}</td></tr>
//           <tr><td><b>Type:</b></td><td>${p.ComplainType}</td></tr>
//           <tr><td><b>City:</b></td><td>${p.City}</td></tr>
//         </table>
//         <button id="navBtn" style="margin-top:12px;padding:8px 16px;background:#1e90ff;border:none;border-radius:6px;color:white;cursor:pointer;">🚗 Navigate</button>
//       </div>
//     `;
//     infoRef.current.setContent(content);
//     infoRef.current.open(mapInstance.current, marker);

//     google.maps.event.addListenerOnce(infoRef.current, "domready", () => {
//       const btn = document.getElementById("navBtn");
//       if (btn) {
//         btn.onclick = () => {
//           const { lat, lng } = marker.getPosition().toJSON();
//           window.open(
//             `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
//           );
//         };
//       }
//     });
//   };

//   // ------------------- SEARCH & FILTER -------------------
//   const handleSearch = (text) => {
//     setSearchKey(text);
//     applyFilters(text, cityFilter);
//   };

//   const applyFilters = (text, city) => {
//     let data = [...complaints];
//     if (city !== "All") data = data.filter((c) => c?.properties?.City === city);
//     if (text) {
//       data = data.filter((c) => {
//         const p = c.properties;
//         return (
//           p.Customer_Name?.toLowerCase().includes(text.toLowerCase()) ||
//           p.TicketNo?.toLowerCase().includes(text.toLowerCase()) ||
//           String(p.Customer_ID)?.includes(text)
//         );
//       });
//     }
//     setFiltered(data);
//   };

//   // ------------------- RENDER -------------------
//   return (
//     <>
//       <div style={{ display: "flex", height: "55vh", width: "250%" }}>
//         {/* SIDEBAR */}
//         <div
//           style={{
//             width: sidebarOpen ? "340px" : "0px",
//             background: "rgba(8,18,46,0.95)",
//             backdropFilter: "blur(6px)",
//             color: "white",
//             overflow: "hidden",
//             transition: "0.3s",
//             borderRight: sidebarOpen ? "1px solid #1e90ff" : "none",
//           }}
//         >
//           {sidebarOpen && (
//             <div style={{ padding: "14px" }}>
//               {/* All Complaints */}
//               <div
//                 onClick={() => {
//                   setCityFilter("All");
//                   applyFilters(searchKey, "All");
//                 }}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: "10px 14px",
//                   borderRadius: "10px",
//                   background: cityFilter === "All" ? "#123673" : "#0b214c",
//                   border:
//                     cityFilter === "All"
//                       ? "1px solid #1e90ff"
//                       : "1px solid #1e90ff50",
//                   cursor: "pointer",
//                   transition: "0.25s",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <span style={{ fontWeight: 700, fontSize: "15px" }}>
//                   All Complaints
//                 </span>
//                 <span
//                   style={{
//                     background: "#ff1e31ff",
//                     padding: "4px 10px",
//                     fontSize: "13px",
//                     borderRadius: "8px",
//                   }}
//                 >
//                   {complaints.length}
//                 </span>
//               </div>

//               {/* ✅ City Dropdown */}
//               <select
//                 value={cityFilter}
//                 onChange={(e) => {
//                   setCityFilter(e.target.value);
//                   applyFilters(searchKey, e.target.value);
//                 }}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   borderRadius: "6px",
//                   marginBottom: "10px",
//                   background: "#071635",
//                   border: "1px solid #1e90ff",
//                   color: "white",
//                 }}
//               >
//                 <option value="All">All Cities</option>
//                 {Object.keys(cityCounts).map((c) => (
//                   <option key={c} value={c}>
//                     {c} ({cityCounts[c]})
//                   </option>
//                 ))}
//               </select>

//               {/* Search */}
//               <input
//                 type="text"
//                 value={searchKey}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search complaints..."
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   borderRadius: "6px",
//                   border: "1px solid #1e90ff",
//                   marginBottom: "15px",
//                   background: "#071635",
//                   color: "white",
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Sidebar Toggle */}
//         <button
//           onClick={() => setSidebarOpen((p) => !p)}
//           style={{
//             position: "fixed",
//             left: sidebarOpen ? "auto" : "auto",
//             top: "75px",
//             zIndex: 9970,
//             padding: "8px 10px",
//             borderRadius: "6px",
//             border: "1px solid #1e90ff",
//             background: "#061833ff",
//             color: "white",
//             cursor: "pointer",
//             transition: "0.3s",
//           }}
//         >
//           {sidebarOpen ? "«" : "»"}
//         </button>

//         {/* MAP */}
//         <div style={{ flex: 1, position: "relative" }}>
//           <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

//           {/* ✅ FIXED INFO WINDOW FOR SELECTED VEHICLE */}
//           {selectedVehicle && (
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "20px",
//                 left: "20px",
//                 background: "#0F2A4D",
//                 color: "white",
//                 borderRadius: "12px",
//                 padding: "14px",
//                 border: "1px solid #1e90ff",
//                 fontFamily: "Arial",
//                 minWidth: "280px",
//                 zIndex: 9999,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <h3 style={{ margin: 0, color: "#58a6ff", fontSize: "17px" }}>
//                   {selectedVehicle.regNo}
//                 </h3>
//                 <button
//                   onClick={() => setSelectedVehicle(null)}
//                   style={{
//                     background: "transparent",
//                     color: "#fff",
//                     border: "none",
//                     fontSize: "16px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   ✖
//                 </button>
//               </div>
//               <table style={{ width: "100%", fontSize: "14px" }}>
//                 <tbody>
//                   <tr>
//                     <td><b>Driver:</b></td>
//                     <td>{selectedVehicle.clientName}</td>
//                   </tr>
//                   <tr>
//                     <td><b>Status:</b></td>
//                     <td>{selectedVehicle.statusName}</td>
//                   </tr>
//                   <tr>
//                     <td><b>Speed:</b></td>
//                     <td>{selectedVehicle.speed} km/h</td>
//                   </tr>
//                   <tr>
//                     <td><b>Odometer:</b></td>
//                     <td>{selectedVehicle.odometer} km</td>
//                   </tr>
//                   <tr>
//                     <td><b>Last Update:</b></td>
//                     <td>{selectedVehicle.eventDate}</td>
//                   </tr>
//                   <tr>
//                     <td><b>Location:</b></td>
//                     <td>{selectedVehicle.location}</td>
//                   </tr>
//                 </tbody>
//               </table>
//               <button
//                 onClick={() =>
//                   window.open(
//                     `https://www.google.com/maps/dir/?api=1&destination=${selectedVehicle.lat},${selectedVehicle.lng}`
//                   )
//                 }
//                 style={{
//                   marginTop: "12px",
//                   padding: "8px 16px",
//                   background: "#1e90ff",
//                   border: "none",
//                   borderRadius: "6px",
//                   color: "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 🚗 Navigate
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default KarachiComplaints;
