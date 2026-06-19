// ====================================================== Code wihtout hover Effect ================================================

// import { useEffect, useRef, useState } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import handholeIcon from "../../../public/images/repair.png";
// import jointsIcon from "../../../public/images/tie.png";
// import customerIcon from "../../../public/images/customers.png"; 
// import customerIconOnline from "../../../public/images/online.png";
// import customerIconOffline from "../../../public/images/offline.png"; 
// import customerIconLOS from "../../../public/images/LOS.png"; 
// import customerIconpowerFail from "../../../public/images/powerFail.png";  
// import fatIcon from "../../../public/images/splitter.png"; // Import customer icon
// import nodeIcon from "../../../public/images/antenna-tower-unscreen.gif";
// import fdtIcon from "../../../public/images/fdt.gif";
// import NationwideMapWidgets from "./NationwideMapWidgets";
// import NetworkExplorerWidget from "./NetworkExplorerWidget";
// import CustomerToOLTRouteWidget from "./CustomerToOLTRouteWidget";                                                                                                                       
// import poleIcon from "../../../public/images/poll.png"; // Import customer icon

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// // =================================================================
// // 🛑 GLOBAL STATE FOR HIGHLIGHT TRACKING:
// let currentHighlightedFiberRef = { current: null };
// const defaultFiberColors = new Map();

// // =================================================================
// // 🛑 INFO WINDOW CONTENT FUNCTION
// const fiberInfoWindowContent = (f) => {
//   const cardStyle = `
//         font-family: 'Segoe UI', Arial;
//         padding: 12px;
//         border-radius: 12px;
//         background: #0F2A4D;
//         color: #FFFFFF;
//         min-width: 240px;                                                                                               
//         box-shadow: 0 4px 15px rgba(0,0,0,0.3);
//         border: 1px solid #1B3A63;
//     `;
//   const headingStyle = `
//         margin: 0 0 8px 0;
//         font-size: 15px;
//         color: #00C2FF;
//         font-weight: 600;
//         text-align: center;
//         letter-spacing: 0.5px;
//     `;
//   const tableStyle = `
//         width: 100%;
//         border-collapse: collapse;
//         font-size: 13px;
//     `;
//   const tdStyle = `
//         padding: 4px 6px;
//         vertical-align: top;
//     `;

//    return `
//       <div style="${cardStyle}">
//         <h3 style="${headingStyle}">Core No - ${f.Core_No || "N/A"}</h3>
//         <table style="${tableStyle}">
//           <tr><td style="${tdStyle}"><strong>FOC ID:</strong></td><td>${f.FOC_ID || "N/A"}</td></tr>
//           <tr><td style="${tdStyle}"><strong>Length (m):</strong></td><td>${f.Calculated_Length || "N/A"}</td></tr>
//           <tr><td style="${tdStyle}"><strong>Connectivity:</strong></td><td>${f.Connectivity_Type || "N/A"}</td></tr>
//           <tr><td style="${tdStyle}"><strong>Ring:</strong></td><td>${f.Ring_Name || "N/A"}</td></tr>
//           <tr><td style="${tdStyle}"><strong>Region:</strong></td><td>${f.Region || "N/A"}</td></tr>
//         </table>
//       </div>
//     `;
// };

// // =================================================================
// // 🛑 CUSTOM HOOK: useFiberHighlight
// const useFiberHighlight = (map, infoWindowRef) => {
//   const clearFiberHighlights = () => {
//     if (currentHighlightedFiberRef.current) {
//       const polyline = currentHighlightedFiberRef.current;
//       const defaultStyle = defaultFiberColors.get(polyline);
//       if (defaultStyle) {
//         polyline.setOptions({
//           strokeColor: defaultStyle.color,
//           strokeWeight: defaultStyle.weight,
//           zIndex: 1,
//         });
//       }
//       currentHighlightedFiberRef.current = null;
//     }
//   };

//   const highlightFiber = (polyline, fiberData, clickPosition) => {
//     if (!map || !infoWindowRef.current) return;

//     clearFiberHighlights();

//     polyline.setOptions({
//       strokeColor: "#00fff7ff",
//       strokeWeight: 8,
//       zIndex: 999,
//     });

//     currentHighlightedFiberRef.current = polyline;

//     const content = fiberInfoWindowContent(fiberData);
//     infoWindowRef.current.setContent(content);
//     infoWindowRef.current.setPosition(clickPosition);
//     infoWindowRef.current.open(map);

//     map.panTo(clickPosition);
//   };

//   useEffect(() => {
//     window.clearFiberHighlights = clearFiberHighlights;
//     return () => {
//       if (window.clearFiberHighlights === clearFiberHighlights) {
//         delete window.clearFiberHighlights;
//       }
//     };
//   }, [map, infoWindowRef]);

//   return { highlightFiber, clearFiberHighlights };
// };

// const normalizeStatus = (raw) => {
//   if (!raw) return "null";
//   const s = String(raw).trim().toLowerCase();
//   if (s === "online") return "Online";
//   if (s === "offline") return "Offline";
//   if (s === "los") return "LOS";
//   if (s === "power fail" || s === "powerfail" || s === "power_fail" || s === "power-fail") return "Power Fail";
//   return "null";
// };

// const getCustomerColor = (status) => {
//   switch (normalizeStatus(status)) {
//     case "Online": return "#00c853";     // green
//     case "Offline": return "#ff9800";    // orange
//     case "Power Fail": return "#ffeb3b"; // yellow
//     case "LOS": return   "#f44336";      // red
//     default: return "#9e9e9e";           // gray for null/unknown
//   }
// };

// const createColoredMarker = (color) => ({
//   path: window.google.maps.SymbolPath.CIRCLE,
//   scale: 6,
//   fillColor: color,
//   fillOpacity: 1,
//   strokeColor: "#000",
//   strokeWeight: 1,
// });


// // import customerIconOnline from "../../../public/images/online.png";
// // import customerIconOffline from "../../../public/images/offline.png"; 
// // import customerIconLOS from "../../../public/images/LOS.png"; 
// // import customerIconpowerFail from "../../../public/images/powerFail.png"; 
// const getCustomerIconUrl = (status) => {
//   const s = normalizeStatus(status);

//   switch (s) {
//     case "Online":
//       return customerIconOnline;
//     case "Offline":
//       return customerIconOffline;
//     case "Power Fail":
//       return customerIconpowerFail;
//     case "LOS":
//       return customerIconLOS;
//     default:
//       return customerIcon;
//   }
// };


// // =================================================================
// // 🛑 MAIN COMPONENT: RawalpindiMap
// // =================================================================

// export default function KarachiMap() {
//   const mapRef = useRef(null);
//   const [map, setMap] = useState(null);

//   const [handholes, setHandholes] = useState([]);
//   const [joints, setJoints] = useState([]);                 
//   const [customers, setCustomers] = useState([]);                 
//   const [poles, setPoles] = useState([]);                 
//   const [nodes, setNodes] = useState([]);
//   const [fat, setFat] = useState([]);
//   const [fdt, setFdt] = useState([]);
//   const [fibers, setFibers] = useState([]);
//   const [fiberAttachments, setFiberAttachments] = useState([]);


//   // 🆕 Parcels
//   const [parcels, setParcels] = useState([]);
//   const [showParcels, setShowParcels] = useState(true);
//   const parcelPolygonsRef = useRef([]);

//   const [showHandholes, setShowHandholes] = useState(true);
//   const [showJoints, setShowJoints] = useState(true);
//   const [showCustomers, setShowCustomers] = useState(true);
//   const [showPoles, setShowPoles] = useState(true);
//   const [showNodes, setShowNodes] = useState(true);
//   const [showFat, setShowFat] = useState(true);
//   const [showFdt, setShowFdt] = useState(true);
//   const [showFibers, setShowFibers] = useState(true);
//   const [showFiberAttachments, setShowFiberAttachments] = useState(true);

//   const [widgetOpen, setWidgetOpen] = useState(false);

//   const handholeMarkersRef = useRef([]);
//   const jointsMarkersRef = useRef([]);
//   const customersMarkersRef = useRef([]);
//   const polesMarkersRef = useRef([]);
//   const nodesMarkersRef = useRef([]);
//   const fatMarkersRef = useRef([]);
//   const fdtMarkersRef = useRef([]);
//   const fiberLinesRef = useRef([]);
//   const infoWindowRef = useRef(null);

//   const handholeClusterRef = useRef(null);
//   const jointsClusterRef = useRef(null);
//   const customersClusterRef = useRef(null);
//   const polesClusterRef = useRef(null);
//   const fatClusterRef = useRef(null);
//   const fdtClusterRef = useRef(null);

//   // 🛑 USE THE HOOK: Get highlight functions
//   const { highlightFiber, clearFiberHighlights } = useFiberHighlight(map, infoWindowRef);

//   const loadGoogleMapsScript = (callback) => {
//     if (window.google) return callback();
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
//     script.async = true;
//     script.defer = true;
//     script.onload = callback;
//     document.body.appendChild(script);
//   };

//   // Data Fetching
//   useEffect(() => { 
//     const fetchData = async (url, setData, parser) => {
//       try {
//         const res = await fetch(url);
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         const cleaned = data.map(parser).filter(Boolean);
//         setData(cleaned);
//       } catch (error) {
//         console.error(`Error fetching data from ${url}:`, error);
//       }
//     };

//     const parseCoordinates = (item) => {
//       const lat = parseFloat(item.Latitude);
//       const lng = parseFloat(item.Longitude);
//       if (isNaN(lat) || isNaN(lng)) return null;
//       return { ...item, Latitude: lat, Longitude: lng };
//     };

//     const parseFat = (f) => {
//   if (!f.SHAPE || !f.SHAPE.points || !f.SHAPE.points.length) return null;

//   const { x, y } = f.SHAPE.points[0];

//   if (isNaN(x) || isNaN(y)) return null;

//   return {
//     ...f,
//     Latitude: y,
//     Longitude: x,
//   };
// };

// const parseFdt = (f) => {
//   if (!f.SHAPE || !f.SHAPE.points || !f.SHAPE.points.length) return null;

//   const { x, y } = f.SHAPE.points[0];

//   if (isNaN(x) || isNaN(y)) return null;

//   return {
//     ...f,
//     Latitude: y,
//     Longitude: x,
//   };
// };

// const parsePoles = (p) => {
//   const shape = p.SHAPE || p.Shape; // ✅ support both cases

//   if (!shape || !shape.points || !shape.points.length) return null;

//   const { x, y } = shape.points[0];

//   if (isNaN(x) || isNaN(y)) return null;

//   return {
//     ...p,
//     Latitude: y,
//     Longitude: x,
//   };
// };

//     const parseFiber = (f) => {
//       if (!f.SHAPE || !f.SHAPE.points) return null;
//       const path = f.SHAPE.points.map((pt) => ({ lat: parseFloat(pt.y), lng: parseFloat(pt.x) }));
//       if (path.some((p) => isNaN(p.lat) || isNaN(p.lng))) return null;
//       return { ...f, path };
//     };

//     const parseFiberAttachment = (fa) => {
//       if (!fa.SHAPE || !fa.SHAPE.points) return null;
//       const path = fa.SHAPE.points.map((pt) => ({ lat: parseFloat(pt.y), lng: parseFloat(pt.x) }));
//       if (path.some((p) => isNaN(p.lat) || isNaN(p.lng))) return null;
//       return { ...fa, path };
//     };

//     fetchData("http://localhost:5000/api/n_handholes", setHandholes, parseCoordinates);
//     fetchData("http://localhost:5000/api/n_joints", setJoints, parseCoordinates);
//     // fetchData("http://localhost:5000/api/n_customers", setCustomers, parseCoordinates);
//     // fetchData("http://localhost:4000/api/merged_customers_olt", setCustomers, parseCoordinates);
//     fetchData("http://localhost:5000/api/n_poles", setPoles, parsePoles);

//     fetchData("http://localhost:5000/api/n_fat_splitter", setFat, parseFat);
//     fetchData("http://localhost:5000/api/n_fdtPon", setFdt, parseFdt);

//     fetchData("http://localhost:5000/api/n_nodes", setNodes, parseCoordinates);
//     fetchData("http://localhost:5000/api/n_metroFiber", setFibers, parseFiber);
//     fetchData("http://localhost:5000/api/n_fa", setFiberAttachments, parseFiberAttachment);

//     const fetchCustomers = async () => {
//   try {
//     const res = await fetch("http://localhost:4000/api/merged_customers_olt");
//     const result = await res.json();
//     const list = Array.isArray(result.data) ? result.data : [];
//     setCustomers(list.map(parseCoordinates).filter(Boolean));
//   } catch (e) {
//     console.error("Customers fetch failed", e);
//   }
// };

// fetchCustomers();
//   }, []);

//   //Parcels
//   useEffect(() => {
//     const fetchData = async (url, setter, parser) => {
//       const r = await fetch(url);
//       const d = await r.json();
//       setter(d.map(parser).filter(Boolean));
//     };

//     const parseCoords = (i) => i.Latitude && i.Longitude ? i : null;

//     const parseParcel = (p) => {
//       if (!p.SHAPE?.points?.length) return null;
//       const path = p.SHAPE.points.map(pt => ({ lat: pt.y, lng: pt.x }));
//       return { ...p, path };
//     };

//     fetchData("http://localhost:5000/api/n_parcl", setParcels, parseParcel);
//   }, []);
//   // Map Initialization
//   useEffect(() => {
//     loadGoogleMapsScript(() => {
//       const Rawalpindi = { lat:30.3753, lng:  69.3451};   
//       // const mapInstance = new window.google.maps.Map(mapRef.current, {
//       //   center: Rawalpindi,
//       //   zoom: 12,
//       //   mapTypeControl: false,
//       //   streetViewControl: false,
//       // });
//       const mapInstance = new window.google.maps.Map(mapRef.current, {
//   center: Rawalpindi,
//   zoom: 5.5,

//   // ✅ Enable Google Maps basemap toggle
//   mapTypeControl: true,
//   mapTypeControlOptions: {
//     style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
//     position: window.google.maps.ControlPosition.BOTTOM_LEFT,
//     mapTypeIds: [
//       window.google.maps.MapTypeId.ROADMAP,
//       window.google.maps.MapTypeId.SATELLITE,
//     ],
//   },

//   streetViewControl: false,
//   fullscreenControl: true,
// });

//       setMap(mapInstance);
//     });
//   }, []);

//   // Left Panel
//   useEffect(() => {
//     let panel = document.getElementById("map-info-panel");
//     if (!panel) {
//       panel = document.createElement("div");
//       panel.id = "map-info-panel";
//       panel.style.cssText = `
//         position: absolute;
//         top: 95px;
//         right: 0;                                                                            
//         width: 280px;
//         min-height: 80vh;
//         max-height: 80vh;
//         overflow-y: auto;
//         border-radius: 18px;
//         background: white;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.25);
//         z-index: 9999;
//         display: none;
//       `;
//       document.body.appendChild(panel);
//     }
//     return () => {
//       const p = document.getElementById("map-info-panel");
//       if (p) p.remove();
//     };
//   }, []);

//   const showLeftPanel = (html) => {
//     const panel = document.getElementById("map-info-panel");
//     if (!panel) return;
//     panel.innerHTML = `
//       <div style="position:relative;">
//         <div style="position:absolute;top:10px;right:12px;z-index:10;">
//           <button id="map-info-close" style="background:transparent;border:none;font-size:35px;cursor:pointer;">&times;</button>
//         </div>
//         ${html}
//       </div>
//     `;
//     panel.style.display = "block";
//     const closeBtn = document.getElementById("map-info-close");
//     if (closeBtn) closeBtn.onclick = () => (panel.style.display = "none");
//   };

//   const buildInfoCard = ({ title, tag, image, list = [] }) => {
//     return `
//       <div style="width:100%;border-radius:16px;background:#fff;font-family:Inter,sans-serif;">
//           <div style="width:100%;height:160px;overflow:hidden;">
//               <img src="${image}"
//                    style="width:100%;height:100%;object-fit:cover;cursor:pointer;"
//                    data-img >
//           </div>
//           <div style="padding:16px;">
//               <h1 style="font-size:18px;font-weight:600;margin:0;color:#1f1f1f;">
//                   ${title}
//               </h1>
//               <p style="font-size:13px;color:#5f6368;margin:4px 0 14px 0;">
//                   ${tag}
//               </p>
//               <div style="margin-bottom:14px;">
//                   ${list.map(item => `
//                       <div style="display:flex;gap:10px;margin:6px 0;">
//                           <span style="font-size:18px;">${item.icon}</span>
//                           <div style="font-size:14px;color:#3c4043;">
//                               <strong>${item.label}</strong><br/>${item.value ?? "N/A"}
//                           </div>
//                       </div>
//                   `).join("")}
//               </div>
//           </div>
//       </div>
//     `;
//   };

//   const attachLightbox = (url) => {
//     const id = "image-lightbox-modal";
//     if (document.getElementById(id)) return;
//     const modal = document.createElement("div");
//     modal.id = id;
//     modal.style.cssText = `
//         position:fixed;inset:0;background:rgba(0,0,0,.95);
//         display:flex;justify-content:center;align-items:center;
//         z-index:10000;cursor:pointer;transition:opacity .3s;opacity:0;
//     `;
//     const img = document.createElement("img");
//     img.src = url;                                                                                  
//     img.style.cssText = `
//         max-width:90%;max-height:90%;object-fit:contain;
//         border-radius:12px;box-shadow:0 0 50px rgba(255,255,255,0.2);
//     `;
//     const btn = document.createElement("div");
//     btn.innerHTML = "&times;";
//     btn.style.cssText = `
//         position:absolute;top:20px;right:30px;color:#fff;
//         font-size:40px;font-weight:bold;
//     `;
//     const closeModal = () => {
//       modal.style.opacity = "0";
//       setTimeout(() => modal.remove(), 300);
//     };
//     modal.appendChild(img);
//     modal.appendChild(btn);
//     modal.onclick = (e) => { if (e.target === modal || e.target === btn) closeModal(); };
//     btn.onclick = closeModal;
//     document.body.appendChild(modal);
//     setTimeout(() => (modal.style.opacity = "1"), 10);
//   };

//   // InfoWindow & Map Rendering
//   useEffect(() => {
//     if (!map) return;
//     if (!infoWindowRef.current) infoWindowRef.current = new window.google.maps.InfoWindow();

//     // Clear previous markers and lines
//     [...handholeMarkersRef.current, ...jointsMarkersRef.current, ...customersMarkersRef.current, ...polesMarkersRef.current, ...nodesMarkersRef.current, ...fatMarkersRef.current, ...fdtMarkersRef.current].forEach(m => m.setMap(null));
//     fiberLinesRef.current.forEach(line => line.setMap(null));
//     if (handholeClusterRef.current) handholeClusterRef.current.clearMarkers();
//     if (jointsClusterRef.current) jointsClusterRef.current.clearMarkers();
//     if (customersClusterRef.current) customersClusterRef.current.clearMarkers();
//     if (polesClusterRef.current) polesClusterRef.current.clearMarkers();
//     if (fatClusterRef.current) fatClusterRef.current.clearMarkers();
//     if (fdtClusterRef.current) fdtClusterRef.current.clearMarkers();
//     handholeMarkersRef.current = [];
//     jointsMarkersRef.current = [];
//     customersMarkersRef.current = [];
//     polesMarkersRef.current = [];
//     nodesMarkersRef.current = [];
//     fatMarkersRef.current = [];
//     fdtMarkersRef.current = [];
//     fiberLinesRef.current = [];
//     clearFiberHighlights();
//     defaultFiberColors.clear();

//     const cardStyle = `font-family: 'Segoe UI', Arial; padding: 12px; border-radius: 12px; background: #0F2A4D; color: #FFFFFF; min-width: 240px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 1px solid #1B3A63;`;
//     const headingStyle = `margin: 0 0 8px 0; font-size: 15px; color: #00C2FF; font-weight: 600; text-align: center; letter-spacing: 0.5px;`;
//     const tableStyle = `width: 100%; border-collapse: collapse; font-size: 13px;`;
//     const tdStyle = `padding: 4px 6px; vertical-align: top;`;

//     // =====================================================================
//     // 🟢 Handholes
//     if (showHandholes) {
//       const markers = handholes.map(hh => {
//         const imageUrl = hh.Image_URL || "https://placehold.co/280x160/34A853/FFFFFF?text=No+Image";
//         const marker = new window.google.maps.Marker({
//           position: { lat: hh.Latitude, lng: hh.Longitude },
//           title: `Handhole: ${hh.HH_ID}`,
//           icon: { url: handholeIcon, scaledSize: new window.google.maps.Size(18, 18) },
//         });
//         marker.addListener("click", () => {
//           const html = buildInfoCard({
//             title: `Handhole #${hh.HH_ID ?? "N/A"}`,
//             tag: "Handhole",
//             image: imageUrl,
//             list: [
//               { icon: "✔️", label: "Condition", value: hh.Condition },
//               { icon: "🔁", label: "Ring Name", value: hh.Ring_Name },
//               { icon: "🌆", label: "City", value: hh.City },
//               { icon: "🏙", label: "Province", value: hh.Province },
//               { icon: "®", label: "Region", value: hh.Region },
//               { icon: "📍", label: "Latitude", value: hh.Latitude },
//               { icon: "📍", label: "Longitude", value: hh.Longitude },
//             ],
//           });
//           showLeftPanel(html);
//           setTimeout(() => {
//             const panelImg = document.querySelector("#map-info-panel img[data-img]");
//             if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
//           }, 200);
//         });
//         return marker;
//       });
//       handholeMarkersRef.current = markers;
//       handholeClusterRef.current = new MarkerClusterer({ map, markers });
//     }

//     // 🔴 Joints
//     if (showJoints) {
//       const markers = joints.map(j => {
//         const imgUrl = j.Image_URL || "https://placehold.co/280x160/4285F4/FFFFFF?text=No+Image";
//         const marker = new window.google.maps.Marker({
//           position: { lat: j.Latitude, lng: j.Longitude },
//           title: `Joint: ${j.Joint_ID}`,
//           icon: { url: jointsIcon, scaledSize: new window.google.maps.Size(18, 18) },
//         });
//         marker.addListener("click", () => {
//           const html = buildInfoCard({
//             title: `Joint #${j.Joint_ID ?? "N/A"}`,
//             tag: "Splicing Point",
//             image: j.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Joints",
//             list: [
//               { icon: "🧵", label: "Splice Type", value: j.Joint_Type || j.Splice_Type },              
//               { icon: "🔁", label: "Ring_Name", value: j.Ring_Name },
//               { icon: "📏", label: "Length", value: j.Length },
//               { icon: "🌆", label: "City", value: j.City },
//             ],
//           });
//           showLeftPanel(html);
//         });
//         return marker;
//       });
//       jointsMarkersRef.current = markers;
//       jointsClusterRef.current = new MarkerClusterer({ map, markers });
//     }

//     // 🟣 Customers
// if (showCustomers) {
//   const markers = customers.map(c => {
//     const marker = new window.google.maps.Marker({
//       position: { lat: c.Latitude, lng: c.Longitude },
//       title: `Customer: ${c.Customer_ID}`,
//       icon: {
//         url: getCustomerIconUrl(c.OLT_Status),
//         scaledSize: new window.google.maps.Size(30, 30),
//         optimized: true,
//       },
//     });

//     marker.addListener("click", () => {
//       const html = buildInfoCard({
//         title: `Customer — ${c.Customer_Name || c.Customer_ID}`,
//         tag: "Customer",
//         image: c.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Customers",
//         list: [
//           { icon: "🆔", label: "Customer ID", value: c.Customer_ID },
//           { icon: "📡", label: "OLT Status", value: normalizeStatus(c.OLT_Status) },
//           { icon: "📍", label: "Latitude", value: c.Latitude },
//           { icon: "📍", label: "Longitude", value: c.Longitude },
//         ],
//       });
//       showLeftPanel(html);
//     });

//     return marker;
//   });

//   customersMarkersRef.current = markers;
//   customersClusterRef.current = new MarkerClusterer({ map, markers });
// }



//     // 🟤 poles
// // 🟤 Poles (FIXED)
// // 🟤 Poles
// if (showPoles) {
//   const markers = poles.map(p => {
//     const imageUrl =
//       p.Image_URL || "https://placehold.co/280x160/FF9800/FFFFFF?text=Pole";

//     const marker = new window.google.maps.Marker({
//       position: {
//         lat: p.Latitude,
//         lng: p.Longitude,
//       },
//       title: `Pole: ${p.Pole_ID}`,
//       icon: {
//         url: poleIcon,
//         scaledSize: new window.google.maps.Size(20, 20),
//       },
//     });

//     marker.addListener("click", () => {
//       const html = buildInfoCard({
//         title: `Pole #${p.Pole_ID ?? "N/A"}`,
//         tag: "Pole",
//         image: imageUrl,
//         list: [
//           { icon: "🆔", label: "Pole ID", value: p.Pole_ID },
//           { icon: "📛", label: "Ring Name", value: p.Ring_Name },
//           { icon: "🌆", label: "City", value: p.City },
//           { icon: "📍", label: "Latitude", value: p.Latitude },
//           { icon: "📍", label: "Longitude", value: p.Longitude },
//         ],
//       });

//       showLeftPanel(html);

//       // ✅ SAME AS HANDHOLE: click to enlarge image
//       setTimeout(() => {
//         const panelImg = document.querySelector(
//           "#map-info-panel img[data-img]"
//         );
//         if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
//       }, 200);
//     });

//     return marker;
//   });

//   polesMarkersRef.current = markers;
//   polesClusterRef.current = new MarkerClusterer({ map, markers });
// }



//     // 🟠 Nodes
//     if (showNodes) {
//       const markers = nodes.map(n => {
//         const imageUrl = n.Image_URL || "https://placehold.co/280x160/34A853/FFFFFF?text=No+Image";
//         const marker = new window.google.maps.Marker({
//           position: { lat: n.Latitude, lng: n.Longitude },
//           title: `Node: ${n.OLT_Name}`,
//           icon: { url: nodeIcon, scaledSize: new window.google.maps.Size(55, 55) },
//         });
//         marker.addListener("click", () => {
//           const html = buildInfoCard({
//             title: `OLT #${n.OLT_Name}`,
//             tag: "OLT",
//             image: imageUrl || "https://placehold.co/280x160/00FF00/000?text=Node",
//             list: [
//               { icon: "🆔", label: "OLT_Name", value: n.OLT_Name },
//               { icon: "🏢", label: "Site Name", value: n.Site_Name },
//               { icon: "📍", label: "Latitude", value: n.Latitude },
//               { icon: "📍", label: "Longitude", value: n.Longitude },
//             ],
//           });
//           showLeftPanel(html);
//             setTimeout(() => {
//             const panelImg = document.querySelector("#map-info-panel img[data-img]");
//             if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
//           }, 200);
//         });
//         return marker;
//       });
//       nodesMarkersRef.current = markers;
//       markers.forEach(m => m.setMap(map));
//     }

// // 🟤 FAT Points (FIXED)
// if (showFat) {
//   const markers = fat.map(f => {
//     const marker = new window.google.maps.Marker({
//       position: {
//         lat: f.Latitude,
//         lng: f.Longitude,
//       },
//       map,
//       title: `FAT: ${f.FAT_ID}`,
//       icon: {
//         url: fatIcon, // you can change icon if needed
//         scaledSize: new window.google.maps.Size(20, 20),
//       },
//     });

//     marker.addListener("click", () => {
//       showLeftPanel(
//         buildInfoCard({
//           title: `FAT #${f.FAT_ID ?? "N/A"}`,
//           tag: "FAT",
//           image: f.Image_URL || "https://placehold.co/280x160/FF9800/FFFFFF?text=FAT",
//           list: [
//             { icon: "🆔", label: "FAT ID", value: f.FAT_ID },
//             { icon: "📛", label: "Name", value: f.Name },
//             { icon: "🔀", label: "Splitter", value: f.FDT_PON_Splitter_ID },
//             { icon: "🔀", label: "Splitter", value: f.FDT_PON_Splitter_ID },
//             { icon: "🔀", label: "Splitter Count", value: f.Splitter_Count },
//             { icon: "📍", label: "Latitude", value: f.Latitude },
//             { icon: "📍", label: "Longitude", value: f.Longitude },
//           ],
//         })
//       );
//     });

//     return marker;
//   });

//   fatMarkersRef.current = markers;
//   fatClusterRef.current = new MarkerClusterer({ map, markers });

// }

// // 🟤 FDT Points (FIXED)
// // 🟤 FDT Points
// if (showFdt) {
//   const markers = fdt.map(f => {
//     const imageUrl =
//       f.Image_URL || "https://placehold.co/280x160/FF9800/FFFFFF?text=FDT";

//     const marker = new window.google.maps.Marker({
//       position: {
//         lat: f.Latitude,
//         lng: f.Longitude,
//       },
//       map,
//       title: `FDT: ${f.FDT_PON_Splitter_ID}`,
//       icon: {
//         url: fdtIcon,
//         scaledSize: new window.google.maps.Size(20, 20),
//       },
//     });

//     marker.addListener("click", () => {
//       const html = buildInfoCard({
//         title: `FDT #${f.FDT_PON_Splitter_ID ?? "N/A"}`,
//         tag: "FDT",
//         image: imageUrl,
//         list: [
//           { icon: "🆔", label: "FDT_PON_Splitter_ID", value: f.FDT_PON_Splitter_ID },
//           { icon: "📛", label: "Name", value: f.Name },
//           { icon: "🔀", label: "Capacity", value: f.Capacity },
//           { icon: "📍", label: "Latitude", value: f.Latitude },
//           { icon: "📍", label: "Longitude", value: f.Longitude },
//         ],
//       });

//       showLeftPanel(html);

//       // ✅ SAME lightbox behavior as Handhole & Pole
//       setTimeout(() => {
//         const panelImg = document.querySelector(
//           "#map-info-panel img[data-img]"
//         );
//         if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
//       }, 200);
//     });

//     return marker;
//   });

//   fdtMarkersRef.current = markers;
//   fdtClusterRef.current = new MarkerClusterer({ map, markers });
// }




//     // =====================================================================
//     // 🔵 Core Network Lines
//     if (showFibers) {
//       fibers.forEach(f => {
//         const polyline = new window.google.maps.Polyline({
//           path: f.path,
//           geodesic: true,
//           strokeColor: "#4285F4",
//           strokeOpacity: 0.8,
//           strokeWeight: 4,
//           map,
//         });
//         defaultFiberColors.set(polyline, { color: "#4285F4", weight: 4 });
//  polyline.addListener("click", (e) => {
//           // Clear previous highlights
//           if (currentHighlightedFiberRef.current) {
//             const previous = currentHighlightedFiberRef.current;
//             const def = defaultFiberColors.get(previous);
//             if (def) previous.setOptions({ strokeColor: def.color, strokeWeight: def.weight, zIndex: 1 });
//           }

//           // Highlight clicked line
//           polyline.setOptions({ strokeColor: "#00fff7ff", strokeWeight: 8, zIndex: 999 });
//           currentHighlightedFiberRef.current = polyline;

//           // Build left-panel content for fiber
//           const html = buildInfoCard({
//             title: `Core — ${f.Core_No ?? "N/A"}`,
//             tag: "Core Network",
//             image: f.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber",
//             list: [
//             { icon: "🧵", label: "FOC ID", value: f.FOC_ID },
//               { icon: "📛", label: "Name", value: f.Name },
//               { icon: "📏", label: "Calculated Length (m)", value: f.Calculated_Length },   
//               { icon: "🌐", label: "Connectivity", value: f.Connectivity_Type },

//               { icon: "🔁", label: "Ring_Name", value: f.Ring_Name },
//               { icon: "🌆", label: "City", value: f.City },

//               { icon: "®", label: "Region", value: f.Region },        
//             ],
//           });

//           showLeftPanel(html);

//           // attach lightbox
//         //   setTimeout(() => {
//         //     const panelImg = document.querySelector("#map-info-panel img[data-img]");
//         //     if (panelImg) panelImg.onclick = () => attachLightbox(f.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber");
//         //   }, 200);

//           // Pan map to click
//           if (e && e.latLng) {
//             map.panTo(e.latLng);
//           }
//         });       
//          fiberLinesRef.current.push(polyline);
//       });
//     }

//     // =====================================================================
//     // 🟡 Fiber Attachments
//     if (showFiberAttachments) {
//       fiberAttachments.forEach(fa => {
//  const polyline = new window.google.maps.Polyline({
//   path: fa.path,
//   geodesic: true,
//   strokeColor: "#4285F4", // same as fiber
//   strokeOpacity: 0,       // hide solid stroke
//   strokeWeight: 4,
//   icons: [
//     {
//       icon: {
//         path: "M 0,-1 0,1", // small vertical dash = dot
//         strokeOpacity: 1,
//         strokeColor: "#4285F4",
//         scale: 4,
//       },
//       offset: "0",
//       repeat: "14px", // spacing between dots
//     },
//   ],
//   map,
// });

// defaultFiberColors.set(polyline, { color: "#4285F4", weight: 4 });
//  polyline.addListener("click", (e) => {
//           // Clear previous highlights
//           if (currentHighlightedFiberRef.current) {
//             const previous = currentHighlightedFiberRef.current;
//             const def = defaultFiberColors.get(previous);
//             if (def) previous.setOptions({ strokeColor: def.color, strokeWeight: def.weight, zIndex: 1 });
//           }

//           // Highlight clicked line
//           polyline.setOptions({ strokeColor: "#00fff7ff", strokeWeight: 8, zIndex: 999 });
//           currentHighlightedFiberRef.current = polyline;

//           // Build left-panel content for fiber
//           const html = buildInfoCard({
//             title: `Core — ${fa.Core_No ?? "N/A"}`,
//             tag: "Fiber Attachment",
//             image: fa.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber Attachment",
//             list: [
//             { icon: "🧵", label: "FA_ID", value: fa.FA_ID },
//               { icon: "📛", label: "Name", value: fa.Name },
//               { icon: "📏", label: "Calculated Length (m)", value: fa.Calculated_Length },   
//               { icon: "🌐", label: "Connectivity", value: fa.Connectivity_Type },

//               { icon: "🔁", label: "Ring_Name", value: fa.Ring_Name },
//               { icon: "🌆", label: "City", value: fa.City },

//               { icon: "®", label: "Region", value: fa.Region },        
//             ],
//           });

//           showLeftPanel(html);

//           // attach lightbox
//         //   setTimeout(() => {
//         //     const panelImg = document.querySelector("#map-info-panel img[data-img]");
//         //     if (panelImg) panelImg.onclick = () => attachLightbox(f.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber");
//         //   }, 200);

//           // Pan map to click
//           if (e && e.latLng) {
//             map.panTo(e.latLng);
//           }
//         });
//          fiberLinesRef.current.push(polyline);
//       });
//     }

//     if (showParcels) {
//       parcels.forEach(p => {
//         const poly = new window.google.maps.Polygon({
//           paths: p.path,
//           strokeColor: "#00C2FF",
//           strokeOpacity: 1,
//           strokeWeight: 2,
//           fillColor: "#00C2FF",
//           fillOpacity: 0.15,
//           map,
//         });

//         poly.addListener("click", () => {
//           alert(`Parcel ${p.OBJECTID}\nStreet: ${p.street}\nPhase: ${p.phase}`);
//         });

//         parcelPolygonsRef.current.push(poly);
//       });
//     }

//   }, [map, parcels, showParcels,handholes, joints, customers, poles, nodes,fat,fdt, fibers, fiberAttachments, showHandholes, showJoints, showCustomers, showPoles, showNodes,showFat, showFdt, showFibers, showFiberAttachments]);

//   return (
//     <MainLayout>
//       <div style={{ height: "78vh", width: "100%" }} ref={mapRef}></div>
//       <NationwideMapWidgets

//     map={map}
//      handholes={handholes}
//   joints={joints}
//   customers={customers}
//   poles={poles}
//   nodes={nodes}
//   fat={fat}
//   fdt={fdt}
//   fibers={fibers}
//     widgetOpen={widgetOpen}
//     setWidgetOpen={setWidgetOpen}
//     showHandholes={showHandholes}
//     setShowHandholes={setShowHandholes}
//     showJoints={showJoints}
//     setShowJoints={setShowJoints}
//     showCustomers={showCustomers}
//     setShowCustomers={setShowCustomers}
//     showPoles={showPoles}
//     setShowPoles={setShowPoles}
//     showNodes={showNodes}
//     setShowNodes={setShowNodes}      
//     showFat={showFat}
//     setShowFat={ setShowFat}            
//     showFdt={showFdt}
//     setShowFdt={setShowFdt}             
//     showFibers={showFibers}
//     setShowFibers={setShowFibers}
//         fiberAttachments={fiberAttachments}
//         showFiberAttachments={showFiberAttachments}
//         setShowFiberAttachments={setShowFiberAttachments}
//       />
//         <NetworkExplorerWidget
//             map={map}
//             customerIcon={customerIcon}
//           />

//           {/* <CustomerToOLTRouteWidget   map={map} /> */}
//     </MainLayout>
//   );
// }

// ====================================================== Code wiht Hover Effect ================================================

import { useEffect, useRef, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import handholeIcon from "../../../public/images/repair.png";
import jointsIcon from "../../../public/images/tie.png";
import customerIcon from "../../../public/images/customers.png";
import customerIconOnline from "../../../public/images/online.png";
import customerIconOffline from "../../../public/images/offline.png";
import customerIconLOS from "../../../public/images/LOS.png";
import customerIconpowerFail from "../../../public/images/powerFail.png";
import fatIcon from "../../../public/images/splitter.png"; // Import customer icon
import nodeIcon from "../../../public/images/antenna-tower-unscreen.gif";
import fdtIcon from "../../../public/images/fdt.gif";
import NationwideMapWidgets from "./NationwideMapWidgets";
import NetworkExplorerWidget from "./NetworkExplorerWidget";
import CustomerToOLTRouteWidget from "./CustomerToOLTRouteWidget";
import poleIcon from "../../../public/images/poll.png"; // Import customer icon
import MapHoverAnalytics from "./HoverAnalyticsPanel";
import FindRoute from "./FindRoute";


const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// =================================================================
// 🛑 GLOBAL STATE FOR HIGHLIGHT TRACKING:
let currentHighlightedFiberRef = { current: null };
const defaultFiberColors = new Map();

// =================================================================
// 🛑 INFO WINDOW CONTENT FUNCTION
const fiberInfoWindowContent = (f) => {
  const cardStyle = `
        font-family: 'Segoe UI', Arial;
        padding: 12px;
        border-radius: 12px;
        background: #0F2A4D;
        color: #FFFFFF;
        min-width: 240px;                                                                                               
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        border: 1px solid #1B3A63;
    `;
  const headingStyle = `
        margin: 0 0 8px 0;
        font-size: 15px;
        color: #00C2FF;
        font-weight: 600;
        text-align: center;
        letter-spacing: 0.5px;
    `;
  const tableStyle = `
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
    `;
  const tdStyle = `
        padding: 4px 6px;
        vertical-align: top;
    `;

  return `
      <div style="${cardStyle}">
        <h3 style="${headingStyle}">Core No - ${f.Core_No || "N/A"}</h3>
        <table style="${tableStyle}">
          <tr><td style="${tdStyle}"><strong>FOC ID:</strong></td><td>${f.FOC_ID || "N/A"}</td></tr>
          <tr><td style="${tdStyle}"><strong>Length (m):</strong></td><td>${f.Calculated_Length || "N/A"}</td></tr>
          <tr><td style="${tdStyle}"><strong>Connectivity:</strong></td><td>${f.Connectivity_Type || "N/A"}</td></tr>
          <tr><td style="${tdStyle}"><strong>Ring:</strong></td><td>${f.Ring_Name || "N/A"}</td></tr>
          <tr><td style="${tdStyle}"><strong>Region:</strong></td><td>${f.Region || "N/A"}</td></tr>
        </table>
      </div>
    `;
};

// =================================================================
// 🛑 CUSTOM HOOK: useFiberHighlight
const useFiberHighlight = (map, infoWindowRef) => {
  const clearFiberHighlights = () => {
    if (currentHighlightedFiberRef.current) {
      const polyline = currentHighlightedFiberRef.current;
      const defaultStyle = defaultFiberColors.get(polyline);
      if (defaultStyle) {
        polyline.setOptions({
          strokeColor: defaultStyle.color,
          strokeWeight: defaultStyle.weight,
          zIndex: 1,
        });
      }
      currentHighlightedFiberRef.current = null;
    }
  };

  const highlightFiber = (polyline, fiberData, clickPosition) => {
    if (!map || !infoWindowRef.current) return;

    clearFiberHighlights();

    polyline.setOptions({
      strokeColor: "#00fff7ff",
      strokeWeight: 8,
      zIndex: 999,
    });

    currentHighlightedFiberRef.current = polyline;

    const content = fiberInfoWindowContent(fiberData);
    infoWindowRef.current.setContent(content);
    infoWindowRef.current.setPosition(clickPosition);
    infoWindowRef.current.open(map);

    map.panTo(clickPosition);
  };

  useEffect(() => {
    window.clearFiberHighlights = clearFiberHighlights;
    return () => {
      if (window.clearFiberHighlights === clearFiberHighlights) {
        delete window.clearFiberHighlights;
      }
    };
  }, [map, infoWindowRef]);

  return { highlightFiber, clearFiberHighlights };
};

const normalizeStatus = (raw) => {
  if (!raw) return "null";
  const s = String(raw).trim().toLowerCase();
  if (s === "online") return "Online";
  if (s === "offline") return "Offline";
  if (s === "los") return "LOS";
  if (s === "power fail" || s === "powerfail" || s === "power_fail" || s === "power-fail") return "Power Fail";
  return "null";
};

const getCustomerColor = (status) => {
  switch (normalizeStatus(status)) {
    case "Online": return "#00c853";     // green
    case "Offline": return "#ff9800";    // orange
    case "Power Fail": return "#ffeb3b"; // yellow
    case "LOS": return "#f44336";      // red
    default: return "#9e9e9e";           // gray for null/unknown
  }
};

const createColoredMarker = (color) => ({
  path: window.google.maps.SymbolPath.CIRCLE,
  scale: 6,
  fillColor: color,
  fillOpacity: 1,
  strokeColor: "#000",
  strokeWeight: 1,
});


// import customerIconOnline from "../../../public/images/online.png";
// import customerIconOffline from "../../../public/images/offline.png"; 
// import customerIconLOS from "../../../public/images/LOS.png"; 
// import customerIconpowerFail from "../../../public/images/powerFail.png"; 
const getCustomerIconUrl = (status) => {
  const s = normalizeStatus(status);

  switch (s) {
    case "Online":
      return customerIconOnline;
    case "Offline":
      return customerIconOffline;
    case "Power Fail":
      return customerIconpowerFail;
    case "LOS":
      return customerIconLOS;
    default:
      return customerIcon;
  }
};


// =================================================================
// 🛑 MAIN COMPONENT: RawalpindiMap
// =================================================================

export default function KarachiMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const [handholes, setHandholes] = useState([]);
  const [joints, setJoints] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [poles, setPoles] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [fat, setFat] = useState([]);
  const [fdt, setFdt] = useState([]);
  const [fibers, setFibers] = useState([]);
  const [fiberAttachments, setFiberAttachments] = useState([]);


  // 🆕 Parcels
  const [parcels, setParcels] = useState([]);
  const [showParcels, setShowParcels] = useState(true);
  const parcelPolygonsRef = useRef([]);

  const [showHandholes, setShowHandholes] = useState(true);
  const [showJoints, setShowJoints] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);
  const [showPoles, setShowPoles] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [showFat, setShowFat] = useState(true);
  const [showFdt, setShowFdt] = useState(true);
  const [showFibers, setShowFibers] = useState(true);
  const [showFiberAttachments, setShowFiberAttachments] = useState(true);

  const [widgetOpen, setWidgetOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);



  const handholeMarkersRef = useRef([]);
  const jointsMarkersRef = useRef([]);
  const customersMarkersRef = useRef([]);
  const polesMarkersRef = useRef([]);
  const nodesMarkersRef = useRef([]);
  const fatMarkersRef = useRef([]);
  const fdtMarkersRef = useRef([]);
  const fiberLinesRef = useRef([]);
  const infoWindowRef = useRef(null);

  const handholeClusterRef = useRef(null);
  const jointsClusterRef = useRef(null);
  const customersClusterRef = useRef(null);
  const polesClusterRef = useRef(null);
  const fatClusterRef = useRef(null);
  const fdtClusterRef = useRef(null);

  // 🛑 USE THE HOOK: Get highlight functions
  const { highlightFiber, clearFiberHighlights } = useFiberHighlight(map, infoWindowRef);

  const loadGoogleMapsScript = (callback) => {
    if (window.google) return callback();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.body.appendChild(script);
  };

  // Data Fetching
  useEffect(() => {
    const fetchData = async (url, setData, parser) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const cleaned = data.map(parser).filter(Boolean);
        setData(cleaned);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    const parseCoordinates = (item) => {
      const lat = parseFloat(item.Latitude);
      const lng = parseFloat(item.Longitude);
      if (isNaN(lat) || isNaN(lng)) return null;
      return { ...item, Latitude: lat, Longitude: lng };
    };

    const parseFat = (f) => {
      if (!f.SHAPE || !f.SHAPE.points || !f.SHAPE.points.length) return null;

      const { x, y } = f.SHAPE.points[0];

      if (isNaN(x) || isNaN(y)) return null;

      return {
        ...f,
        Latitude: y,
        Longitude: x,
      };
    };

    const parseFdt = (f) => {
      if (!f.SHAPE || !f.SHAPE.points || !f.SHAPE.points.length) return null;

      const { x, y } = f.SHAPE.points[0];

      if (isNaN(x) || isNaN(y)) return null;

      return {
        ...f,
        Latitude: y,
        Longitude: x,
      };
    };

    const parsePoles = (p) => {
      const shape = p.SHAPE || p.Shape; // ✅ support both cases

      if (!shape || !shape.points || !shape.points.length) return null;

      const { x, y } = shape.points[0];

      if (isNaN(x) || isNaN(y)) return null;

      return {
        ...p,
        Latitude: y,
        Longitude: x,
      };
    };

    const parseFiber = (f) => {
      if (!f.SHAPE || !f.SHAPE.points) return null;
      const path = f.SHAPE.points.map((pt) => ({ lat: parseFloat(pt.y), lng: parseFloat(pt.x) }));
      if (path.some((p) => isNaN(p.lat) || isNaN(p.lng))) return null;
      return { ...f, path };
    };

    const parseFiberAttachment = (fa) => {
      if (!fa.SHAPE || !fa.SHAPE.points) return null;
      const path = fa.SHAPE.points.map((pt) => ({ lat: parseFloat(pt.y), lng: parseFloat(pt.x) }));
      if (path.some((p) => isNaN(p.lat) || isNaN(p.lng))) return null;
      return { ...fa, path };
    };

    fetchData("http://103.31.83.47:5000/api/n_handholes", setHandholes, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/n_joints", setJoints, parseCoordinates);
    // fetchData("http://103.31.83.47:5000/api/n_customers", setCustomers, parseCoordinates);
    // fetchData("http://103.31.83.47:4000/api/merged_customers_olt", setCustomers, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/n_poles", setPoles, parsePoles);

    fetchData("http://103.31.83.47:5000/api/n_fat_splitter", setFat, parseFat);
    fetchData("http://103.31.83.47:5000/api/n_fdtPon", setFdt, parseFdt);

    fetchData("http://103.31.83.47:5000/api/n_nodes", setNodes, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/n_metroFiber", setFibers, parseFiber);
    fetchData("http://103.31.83.47:5000/api/n_fa", setFiberAttachments, parseFiberAttachment);

    const fetchCustomers = async () => {
      try {
        // const res = await fetch("http://103.31.83.47:8100/api/merged_customers_olt");
        const res = await fetch("http://103.31.83.47:8100/api/merged_optixcustomers_olt");
        const result = await res.json();
        const list = Array.isArray(result.data) ? result.data : [];
        setCustomers(list.map(parseCoordinates).filter(Boolean));
      } catch (e) {
        console.error("Customers fetch failed", e);
      }
    };

    fetchCustomers();
  }, []);

  //Parcels
  useEffect(() => {
    const fetchData = async (url, setter, parser) => {
      const r = await fetch(url);
      const d = await r.json();
      setter(d.map(parser).filter(Boolean));
    };

    const parseCoords = (i) => i.Latitude && i.Longitude ? i : null;

    const parseParcel = (p) => {
      if (!p.SHAPE?.points?.length) return null;
      const path = p.SHAPE.points.map(pt => ({ lat: pt.y, lng: pt.x }));
      return { ...p, path };
    };

    fetchData("http://103.31.83.47:5000/api/n_parcl", setParcels, parseParcel);
  }, []);
  // Map Initialization
  useEffect(() => {
    loadGoogleMapsScript(() => {
      const Rawalpindi = { lat: 30.3753, lng: 69.3451 };
      // const mapInstance = new window.google.maps.Map(mapRef.current, {
      //   center: Rawalpindi,
      //   zoom: 12,
      //   mapTypeControl: false,
      //   streetViewControl: false,
      // });
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: Rawalpindi,
        zoom: 5.5,

        // ✅ Enable Google Maps basemap toggle
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.BOTTOM_LEFT,
          mapTypeIds: [
            window.google.maps.MapTypeId.ROADMAP,
            window.google.maps.MapTypeId.SATELLITE,
          ],
        },

        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(mapInstance);
    });
  }, []);

  // Left Panel
  useEffect(() => {
    let panel = document.getElementById("map-info-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "map-info-panel";
      panel.style.cssText = `
        position: absolute;
        top: 130px;
        right: 0;                                                                            
        width: 280px;
        min-height: 78vh;
        max-height: 78vh;
        overflow-y: auto;
        border-radius: 18px;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        z-index: 9999;
        display: none;
      `;
      document.body.appendChild(panel);
    }
    return () => {
      const p = document.getElementById("map-info-panel");
      if (p) p.remove();
    };
  }, []);

  const showLeftPanel = (html) => {
    const panel = document.getElementById("map-info-panel");
    if (!panel) return;
    panel.innerHTML = `
      <div style="position:relative;">
        <div style="position:absolute;top:10px;right:12px;z-index:10;">
          <button id="map-info-close" style="background:transparent;border:none;font-size:35px;cursor:pointer;">&times;</button>
        </div>
        ${html}
      </div>
    `;
    panel.style.display = "block";
    const closeBtn = document.getElementById("map-info-close");
    if (closeBtn) closeBtn.onclick = () => (panel.style.display = "none");
  };

  const buildInfoCard = ({ title, tag, image, list = [] }) => {
    return `
      <div style="width:100%;border-radius:16px;background:#fff;font-family:Inter,sans-serif;">
          <div style="width:100%;height:160px;overflow:hidden;">
              <img src="${image}"
                   style="width:100%;height:100%;object-fit:cover;cursor:pointer;"
                   data-img >
          </div>
          <div style="padding:16px;">
              <h1 style="font-size:18px;font-weight:600;margin:0;color:#1f1f1f;">
                  ${title}
              </h1>
              <p style="font-size:13px;color:#5f6368;margin:4px 0 14px 0;">
                  ${tag}
              </p>
              <div style="margin-bottom:14px;">
                  ${list.map(item => `
                      <div style="display:flex;gap:10px;margin:6px 0;">
                          <span style="font-size:18px;">${item.icon}</span>
                          <div style="font-size:14px;color:#3c4043;">
                              <strong>${item.label}</strong><br/>${item.value ?? "N/A"}
                          </div>
                      </div>
                  `).join("")}
              </div>
          </div>
      </div>
    `;
  };

  const attachLightbox = (url) => {
    const id = "image-lightbox-modal";
    if (document.getElementById(id)) return;
    const modal = document.createElement("div");
    modal.id = id;
    modal.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.95);
        display:flex;justify-content:center;align-items:center;
        z-index:10000;cursor:pointer;transition:opacity .3s;opacity:0;
    `;
    const img = document.createElement("img");
    img.src = url;
    img.style.cssText = `
        max-width:90%;max-height:90%;object-fit:contain;
        border-radius:12px;box-shadow:0 0 50px rgba(255,255,255,0.2);
    `;
    const btn = document.createElement("div");
    btn.innerHTML = "&times;";
    btn.style.cssText = `
        position:absolute;top:20px;right:30px;color:#fff;
        font-size:40px;font-weight:bold;
    `;
    const closeModal = () => {
      modal.style.opacity = "0";
      setTimeout(() => modal.remove(), 300);
    };
    modal.appendChild(img);
    modal.appendChild(btn);
    modal.onclick = (e) => { if (e.target === modal || e.target === btn) closeModal(); };
    btn.onclick = closeModal;
    document.body.appendChild(modal);
    setTimeout(() => (modal.style.opacity = "1"), 10);
  };

  // InfoWindow & Map Rendering
  useEffect(() => {
    if (!map) return;
    if (!infoWindowRef.current) infoWindowRef.current = new window.google.maps.InfoWindow();

    // Clear previous markers and lines
    [...handholeMarkersRef.current, ...jointsMarkersRef.current, ...customersMarkersRef.current, ...polesMarkersRef.current, ...nodesMarkersRef.current, ...fatMarkersRef.current, ...fdtMarkersRef.current].forEach(m => m.setMap(null));
    fiberLinesRef.current.forEach(line => line.setMap(null));
    if (handholeClusterRef.current) handholeClusterRef.current.clearMarkers();
    if (jointsClusterRef.current) jointsClusterRef.current.clearMarkers();
    if (customersClusterRef.current) customersClusterRef.current.clearMarkers();
    if (polesClusterRef.current) polesClusterRef.current.clearMarkers();
    if (fatClusterRef.current) fatClusterRef.current.clearMarkers();
    if (fdtClusterRef.current) fdtClusterRef.current.clearMarkers();
    handholeMarkersRef.current = [];
    jointsMarkersRef.current = [];
    customersMarkersRef.current = [];
    polesMarkersRef.current = [];
    nodesMarkersRef.current = [];
    fatMarkersRef.current = [];
    fdtMarkersRef.current = [];
    fiberLinesRef.current = [];
    clearFiberHighlights();
    defaultFiberColors.clear();

    const cardStyle = `font-family: 'Segoe UI', Arial; padding: 12px; border-radius: 12px; background: #0F2A4D; color: #FFFFFF; min-width: 240px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 1px solid #1B3A63;`;
    const headingStyle = `margin: 0 0 8px 0; font-size: 15px; color: #00C2FF; font-weight: 600; text-align: center; letter-spacing: 0.5px;`;
    const tableStyle = `width: 100%; border-collapse: collapse; font-size: 13px;`;
    const tdStyle = `padding: 4px 6px; vertical-align: top;`;

    // =====================================================================
    // 🟢 Handholes
    if (showHandholes) {
      const markers = handholes.map(hh => {
        const imageUrl = hh.Image_URL || "https://placehold.co/280x160/34A853/FFFFFF?text=No+Image";
        const marker = new window.google.maps.Marker({
          position: { lat: hh.Latitude, lng: hh.Longitude },
          title: `Handhole: ${hh.HH_ID}`,
          icon: { url: handholeIcon, scaledSize: new window.google.maps.Size(18, 18) },
        });


        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `Handhole #${hh.HH_ID ?? "N/A"}`,
            tag: "Handhole",
            image: imageUrl,
            list: [
              { icon: "✔️", label: "Condition", value: hh.Condition },
              { icon: "🔁", label: "Ring Name", value: hh.Ring_Name },
              { icon: "🌆", label: "City", value: hh.City },
              { icon: "🏙", label: "Province", value: hh.Province },
              { icon: "®", label: "Region", value: hh.Region },
              { icon: "📍", label: "Latitude", value: hh.Latitude },
              { icon: "📍", label: "Longitude", value: hh.Longitude },
            ],
          });
          showLeftPanel(html);
          setTimeout(() => {
            const panelImg = document.querySelector("#map-info-panel img[data-img]");
            if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
          }, 200);
        });
        return marker;
      });
      handholeMarkersRef.current = markers;
      handholeClusterRef.current = new MarkerClusterer({ map, markers });
    }

    // 🔴 Joints
    if (showJoints) {
      const markers = joints.map(j => {
        const imgUrl = j.Image_URL || "https://placehold.co/280x160/4285F4/FFFFFF?text=No+Image";
        const marker = new window.google.maps.Marker({
          position: { lat: j.Latitude, lng: j.Longitude },
          title: `Joint: ${j.Joint_ID}`,
          icon: { url: jointsIcon, scaledSize: new window.google.maps.Size(18, 18) },
        });
        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `Joint #${j.Joint_ID ?? "N/A"}`,
            tag: "Splicing Point",
            image: j.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Joints",
            list: [
              { icon: "🧵", label: "Splice Type", value: j.Joint_Type || j.Splice_Type },
              { icon: "🔁", label: "Ring_Name", value: j.Ring_Name },
              { icon: "📏", label: "Length", value: j.Length },
              { icon: "🌆", label: "City", value: j.City },
              { icon: "📍", label: "Latitude", value: j.Latitude },
              { icon: "📍", label: "Longitude", value: j.Longitude },
            ],
          });
          showLeftPanel(html);
        });
        return marker;
      });
      jointsMarkersRef.current = markers;
      jointsClusterRef.current = new MarkerClusterer({ map, markers });
    }

    // 🟣 Customers
    if (showCustomers) {
      const markers = customers.map(c => {
        const marker = new window.google.maps.Marker({
          position: { lat: c.Latitude, lng: c.Longitude },
          title: `Customer: ${c.Customer_ID}`,
          icon: {
            url: getCustomerIconUrl(c.OLT_Status),
            scaledSize: new window.google.maps.Size(30, 30),
            optimized: true,
          },
        });
        marker.addListener("mouseover", () =>
          setHoveredFeature({ type: "customer", data: c })
        );
        marker.addListener("mouseout", () => setHoveredFeature(null));


        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `Customer — ${c.Customer_Name || c.Customer_ID}`,
            tag: "Customer",
            image: c.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Customers",
            list: [
              { icon: "🆔", label: "Customer ID", value: c.Customer_ID },
              { icon: "🏢", label: "OLT Name", value: c.OLT_Name },
              { icon: "〽", label: "Customer Type", value: c.CustomerType },
              { icon: "📡", label: "Optix Status", value: c.Optix_Status },
              { icon: "🅿", label: "Optix Package", value: c.Optix_Package },
              {
                icon: "🕙",
                label: "Activation Date",
                value: new Date(c.Activation_Date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
              { icon: "🅱", label: "OLT Board", value: c.OLT_Board },
              { icon: "🅱", label: "OLT port", value: c.OLT_port },
              { icon: "🗼", label: "FDT_PON_Splitter_ID", value: c.FDT_PON_Splitter_ID },
              { icon: "🏗", label: "FAT_Splitter_ID", value: c.FAT_Splitter_ID },
              { icon: "🏙", label: "City Name", value: c.CityName },
              { icon: "📡", label: "OLT Status", value: normalizeStatus(c.OLT_Status) },
              { icon: "📍", label: "Latitude", value: c.Latitude },
              { icon: "📍", label: "Longitude", value: c.Longitude },
            ],
          });
          showLeftPanel(html);
        });

        return marker;
      });

      customersMarkersRef.current = markers;
      customersClusterRef.current = new MarkerClusterer({ map, markers });
    }



    // 🟤 poles
    // 🟤 Poles (FIXED)
    // 🟤 Poles
    if (showPoles) {
      const markers = poles.map(p => {
        const imageUrl =
          p.Image_URL || "https://placehold.co/280x160/FF9800/FFFFFF?text=Pole";

        const marker = new window.google.maps.Marker({
          position: {
            lat: p.Latitude,
            lng: p.Longitude,
          },
          title: `Pole: ${p.Pole_ID}`,
          icon: {
            url: poleIcon,
            scaledSize: new window.google.maps.Size(20, 20),
          },
        });

        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `Pole #${p.Pole_ID ?? "N/A"}`,
            tag: "Pole",
            image: imageUrl,
            list: [
              { icon: "🆔", label: "Pole ID", value: p.Pole_ID },
              { icon: "📛", label: "Ring Name", value: p.Ring_Name },
              { icon: "🌆", label: "City", value: p.City },
              { icon: "📍", label: "Latitude", value: p.Latitude },
              { icon: "📍", label: "Longitude", value: p.Longitude },
            ],
          });

          showLeftPanel(html);

          // ✅ SAME AS HANDHOLE: click to enlarge image
          setTimeout(() => {
            const panelImg = document.querySelector(
              "#map-info-panel img[data-img]"
            );
            if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
          }, 200);
        });

        return marker;
      });

      polesMarkersRef.current = markers;
      polesClusterRef.current = new MarkerClusterer({ map, markers });
    }



    // 🟠 Nodes
    if (showNodes) {
      const markers = nodes.map(n => {
        const imageUrl = n.Image_URL || "https://placehold.co/280x160/34A853/FFFFFF?text=No+Image";
        const marker = new window.google.maps.Marker({
          position: { lat: n.Latitude, lng: n.Longitude },
          title: `Node: ${n.OLT_Name}`,
          icon: { url: nodeIcon, scaledSize: new window.google.maps.Size(55, 55) },
        });

        marker.addListener("mouseover", () =>
          setHoveredFeature({ type: "node", data: n })
        );


        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `OLT #${n.OLT_Name}`,
            tag: "OLT",
            image: imageUrl || "https://placehold.co/280x160/00FF00/000?text=Node",
            list: [
              { icon: "🆔", label: "OLT_Name", value: n.OLT_Name },
              { icon: "🏢", label: "Site Name", value: n.Site_Name },
              { icon: "📍", label: "Latitude", value: n.Latitude },
              { icon: "📍", label: "Longitude", value: n.Longitude },
            ],
          });
          showLeftPanel(html);
          setTimeout(() => {
            const panelImg = document.querySelector("#map-info-panel img[data-img]");
            if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
          }, 200);
        });
        return marker;
      });
      nodesMarkersRef.current = markers;
      markers.forEach(m => m.setMap(map));
    }

    // 🟤 FAT Points (FIXED)
    if (showFat) {
      const markers = fat.map(f => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: f.Latitude,
            lng: f.Longitude,
          },
          map,
          title: `FAT: ${f.FAT_ID}`,
          icon: {
            url: fatIcon, // you can change icon if needed
            scaledSize: new window.google.maps.Size(20, 20),
          },
        });

        marker.addListener("click", () => {
          showLeftPanel(
            buildInfoCard({
              title: `FAT #${f.FAT_ID ?? "N/A"}`,
              tag: "FAT",
              image: f.Image_URL || "https://placehold.co/280x160/FF9800/FFFFFF?text=FAT",
              list: [
                { icon: "🆔", label: "FAT ID", value: f.FAT_ID },
                { icon: "📛", label: "Name", value: f.Name },
                { icon: "🔀", label: "Splitter", value: f.FDT_PON_Splitter_ID },
                { icon: "🔀", label: "Splitter", value: f.FDT_PON_Splitter_ID },
                { icon: "🔀", label: "Splitter Count", value: f.Splitter_Count },
                { icon: "📍", label: "Latitude", value: f.Latitude },
                { icon: "📍", label: "Longitude", value: f.Longitude },
              ],
            })
          );
        });

        return marker;
      });

      fatMarkersRef.current = markers;
      fatClusterRef.current = new MarkerClusterer({ map, markers });

    }

    // 🟤 FDT Points (FIXED)
    // 🟤 FDT Points
    if (showFdt) {
      const markers = fdt.map(f => {
        const imageUrl =
          f.Image_URL || "https://placehold.co/280x160/FF9800/FFFFFF?text=FDT";

        const marker = new window.google.maps.Marker({
          position: {
            lat: f.Latitude,
            lng: f.Longitude,
          },
          map,
          title: `FDT: ${f.FDT_PON_Splitter_ID}`,
          icon: {
            url: fdtIcon,
            scaledSize: new window.google.maps.Size(28, 28),
          },
        });

        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `FDT #${f.FDT_PON_Splitter_ID ?? "N/A"}`,
            tag: "FDT",
            image: imageUrl,
            list: [
              { icon: "🆔", label: "FDT_PON_Splitter_ID", value: f.FDT_PON_Splitter_ID },
              { icon: "📛", label: "Name", value: f.Name },
              { icon: "🔀", label: "Capacity", value: f.Capacity },
              { icon: "📍", label: "Latitude", value: f.Latitude },
              { icon: "📍", label: "Longitude", value: f.Longitude },
            ],
          });

          showLeftPanel(html);

          // ✅ SAME lightbox behavior as Handhole & Pole
          setTimeout(() => {
            const panelImg = document.querySelector(
              "#map-info-panel img[data-img]"
            );
            if (panelImg) panelImg.onclick = () => attachLightbox(imageUrl);
          }, 200);
        });

        return marker;
      });

      fdtMarkersRef.current = markers;
      fdtClusterRef.current = new MarkerClusterer({ map, markers });
    }




    // =====================================================================
    // 🔵 Core Network Lines
    if (showFibers) {
      fibers.forEach(f => {

        // Decide color based on Connectivity_Type
        const fiberColor =
          f.Connectivity_Type === "Aerial"
            ? "#0000FF"        // Blue
            : f.Connectivity_Type === "Buried"
              ? "#5eff1f"        // Light Green
              : "#4285F4";       // Default fallback


        const polyline = new window.google.maps.Polyline({
          path: f.path,
          geodesic: true,
          strokeColor: fiberColor,
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map,
        });
        defaultFiberColors.set(polyline, { color: fiberColor, weight: 4 });

        polyline.addListener("mouseover", () =>
          setHoveredFeature({ type: "fiber", data: f })
        );


        polyline.addListener("click", (e) => {
          // Clear previous highlights
          if (currentHighlightedFiberRef.current) {
            const previous = currentHighlightedFiberRef.current;
            const def = defaultFiberColors.get(previous);
            if (def) previous.setOptions({ strokeColor: def.color, strokeWeight: def.weight, zIndex: 1 });
          }

          // Highlight clicked line
          polyline.setOptions({ strokeColor: "#00fff7ff", strokeWeight: 8, zIndex: 999 });
          currentHighlightedFiberRef.current = polyline;

          // Build left-panel content for fiber
          const html = buildInfoCard({
            title: `Core — ${f.Core_No ?? "N/A"}`,
            tag: "Core Network",
            image: f.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber",
            list: [
              { icon: "🧵", label: "FOC ID", value: f.FOC_ID },
              { icon: "📛", label: "Name", value: f.Name },
              { icon: "📏", label: "Calculated Length (m)", value: f.Calculated_Length },
              { icon: "🌐", label: "Connectivity", value: f.Connectivity_Type },

              { icon: "🔁", label: "Ring_Name", value: f.Ring_Name },
              { icon: "🌆", label: "City", value: f.City },

              { icon: "®", label: "Region", value: f.Region },
            ],
          });

          showLeftPanel(html);

          // attach lightbox
          //   setTimeout(() => {
          //     const panelImg = document.querySelector("#map-info-panel img[data-img]");
          //     if (panelImg) panelImg.onclick = () => attachLightbox(f.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber");
          //   }, 200);

          // Pan map to click
          if (e && e.latLng) {
            map.panTo(e.latLng);
          }
        });
        fiberLinesRef.current.push(polyline);
      });
    }

    // =====================================================================
    // 🟡 Fiber Attachments

    if (showFiberAttachments) {
      fiberAttachments.forEach(fa => {

        // Decide color based on Connectivity_Type
        const attachmentColor =
          fa.Connectivity_Type === "Aerial"
            ? "#0000FF"        // Blue
            : fa.Connectivity_Type === "Buried"
              ? "#45f442"        // Light Green
              : "#4285F4";       // Default fallback



        const polyline = new window.google.maps.Polyline({
          path: fa.path,
          geodesic: true,
          strokeColor: attachmentColor, // base color
          strokeOpacity: 0,              // hide solid stroke
          strokeWeight: 4,
          icons: [
            {
              icon: {
                path: "M 0,-1 0,1",       // dotted line
                strokeOpacity: 1,
                strokeColor: attachmentColor, // dot color
                scale: 4,
              },
              offset: "0",
              repeat: "14px",
            },
          ],
          map,
        });

        // Store default color
        defaultFiberColors.set(polyline, { color: attachmentColor, weight: 4 });

        polyline.addListener("click", (e) => {
          // Clear previous highlights
          if (currentHighlightedFiberRef.current) {
            const previous = currentHighlightedFiberRef.current;
            const def = defaultFiberColors.get(previous);

            if (def) {
              previous.setOptions({
                strokeColor: def.color,
                strokeWeight: def.weight,
                zIndex: 1,
                icons: [
                  {
                    icon: {
                      path: "M 0,-1 0,1",
                      strokeOpacity: 1,
                      strokeColor: def.color,
                      scale: def.iconScale,
                    },
                    offset: "0",
                    repeat: "14px",
                  },
                ],
              });
            }
          }


          // Highlight clicked attachment
          polyline.setOptions({
            zIndex: 999,
            icons: [
              {
                icon: {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 1,
                  strokeColor: "#00fff7",
                  scale: 7, // 🔥 visible highlight
                },
                offset: "0",
                repeat: "10px",
              },
            ],
          });

          currentHighlightedFiberRef.current = polyline;

          // Build left-panel content
          const html = buildInfoCard({
            title: `Core — ${fa.Core_No ?? "N/A"}`,
            tag: "Fiber Attachment",
            image: fa.Image_URL || "https://placehold.co/280x160/673AB7/FFFFFF?text=Fiber Attachment",
            list: [
              { icon: "🧵", label: "FA_ID", value: fa.FA_ID },
              { icon: "📛", label: "Name", value: fa.Name },
              { icon: "📏", label: "Calculated Length (m)", value: fa.Calculated_Length },
              { icon: "🌐", label: "Connectivity", value: fa.Connectivity_Type },
              { icon: "🔁", label: "Ring_Name", value: fa.Ring_Name },
              { icon: "🌆", label: "City", value: fa.City },
              { icon: "®", label: "Region", value: fa.Region },
            ],
          });

          showLeftPanel(html);

          if (e && e.latLng) {
            map.panTo(e.latLng);
          }
        });

        fiberLinesRef.current.push(polyline);
      });
    }

    if (showParcels) {
      parcels.forEach(p => {
        const poly = new window.google.maps.Polygon({
          paths: p.path,
          strokeColor: "#00C2FF",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#00C2FF",
          fillOpacity: 0.15,
          map,
        });

        poly.addListener("click", () => {
          alert(`Parcel ${p.OBJECTID}\nStreet: ${p.street}\nPhase: ${p.phase}`);
        });

        parcelPolygonsRef.current.push(poly);
      });
    }

  }, [map, parcels, showParcels, handholes, joints, customers, poles, nodes, fat, fdt, fibers, fiberAttachments, showHandholes, showJoints, showCustomers, showPoles, showNodes, showFat, showFdt, showFibers, showFiberAttachments]);

  return (
    <MainLayout>
      <div style={{ height: "78vh", width: "100%" }} ref={mapRef}></div>
      {map && <FindRoute map={map} />}

      <NationwideMapWidgets

        map={map}
        handholes={handholes}
        joints={joints}
        customers={customers}
        poles={poles}
        nodes={nodes}
        fat={fat}
        fdt={fdt}
        fibers={fibers}
        widgetOpen={widgetOpen}
        setWidgetOpen={setWidgetOpen}
        showHandholes={showHandholes}
        setShowHandholes={setShowHandholes}
        showJoints={showJoints}
        setShowJoints={setShowJoints}
        showCustomers={showCustomers}
        setShowCustomers={setShowCustomers}
        showPoles={showPoles}
        setShowPoles={setShowPoles}
        showNodes={showNodes}
        setShowNodes={setShowNodes}
        showFat={showFat}
        setShowFat={setShowFat}
        showFdt={showFdt}
        setShowFdt={setShowFdt}
        showFibers={showFibers}
        setShowFibers={setShowFibers}
        fiberAttachments={fiberAttachments}
        showFiberAttachments={showFiberAttachments}
        setShowFiberAttachments={setShowFiberAttachments}
      />
      <NetworkExplorerWidget
        map={map}
        customerIcon={customerIcon}
      />

      {/* <CustomerToOLTRouteWidget   map={map} /> */}
      {/* <MapHoverAnalytics hoveredFeature={hoveredFeature} /> */}

    </MainLayout>
  );
}

