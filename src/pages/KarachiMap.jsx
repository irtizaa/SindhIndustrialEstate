// import { useEffect, useRef, useState } from "react";
// import MainLayout from "../layouts/MainLayout";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import handholeIcon from "../../public/images/repair.png";
// import jointsIcon from "../../public/images/tie.png";
// import customerIcon from "../../public/images/customers.png";
// import nodeIcon from "../../public/images/antenna-tower-unscreen.gif";
// import fatIcon from "../../public/images/splitter.png"; // Import customer icon
// import poleIcon from "../../public/images/poll.png"; // Import customer icon
// import fdtIcon from "../../public/images/fdt.gif"; // Import customer icon
// import KarachiMapWidgets from "./KarachiMapWidgets";
// import FindRoute from "./FindRoute";
// // NOTE: Assuming KarachiMap.css exists for styling, if not, you'd need to create one.

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

//     fetchData("http://localhost:5000/api/handholes", setHandholes, parseCoordinates);
//     fetchData("http://localhost:5000/api/joints", setJoints, parseCoordinates);
//     fetchData("http://localhost:5000/api/customers", setCustomers, parseCoordinates);
//     fetchData("http://localhost:5000/api/poles", setPoles, parsePoles);

//     fetchData("http://localhost:5000/api/fat", setFat, parseFat);
//     fetchData("http://localhost:5000/api/fdt", setFdt, parseFdt);

//     fetchData("http://localhost:5000/api/nodes", setNodes, parseCoordinates);
//     fetchData("http://localhost:5000/api/metrofiber", setFibers, parseFiber);
//     fetchData("http://localhost:5000/api/faRoutes", setFiberAttachments, parseFiberAttachment);
//   }, []);

//   // Map Initialization
//   useEffect(() => {
//     loadGoogleMapsScript(() => {
//       const Rawalpindi = { lat: 24.8607, lng:  67.0011 };
//       // const mapInstance = new window.google.maps.Map(mapRef.current, {
//       //   center: Rawalpindi,
//       //   zoom: 12,
//       //   mapTypeControl: false,
//       //   streetViewControl: false,
//       // });
//       const mapInstance = new window.google.maps.Map(mapRef.current, {
//   center: Rawalpindi,
//   zoom: 12,

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
//             top: 130px;
//         right: 0;                                                                            
//         width: 280px;
//         min-height: 78vh;
//         max-height: 78vh;
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
              
//           { icon: "📍", label: "Latitude", value: j.Latitude },
//           { icon: "📍", label: "Longitude", value: j.Longitude },
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
//     if (showCustomers) {
//       const markers = customers.map(c => {
//         const marker = new window.google.maps.Marker({
//           position: { lat: c.Latitude, lng: c.Longitude },
//           title: `Customer: ${c.Customer_ID}`,
//           icon: { url: customerIcon, scaledSize: new window.google.maps.Size(18, 18) },
//         });
//         marker.addListener("click", () => {
//           const html = buildInfoCard({
//             title: `Customer #${c.Customer_Name || c.Customer_ID}`,
//             tag: "Customer",
//             image: c.Image_URL || "https://placehold.co/280x160/FF0000/FFFFFF?text=Customer",
//             list: [
//               { icon: "🆔", label: "Customer ID", value: c.Customer_ID },
//               { icon: "🏢", label: "OLT_Name", value: c.OLT_Name },
//               { icon: "📍", label: "Latitude", value: c.Latitude },
//               { icon: "📍", label: "Longitude", value: c.Longitude },
//             ],
//           });
//           showLeftPanel(html);
//         });
//         return marker;
//       });
//       customersMarkersRef.current = markers;
//       customersClusterRef.current = new MarkerClusterer({ map, markers });
//     }

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
//         scaledSize: new window.google.maps.Size(27, 27),
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
//         const polyline = new window.google.maps.Polyline({
//           path: fa.path,
//           geodesic: true,
//           strokeColor: "#FFD700",
//           strokeOpacity: 0.9,
//           strokeWeight: 4,
//           map,
//         });
//         defaultFiberColors.set(polyline, { color: "#FFD700", weight: 4 });
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

//   }, [map, handholes, joints, customers, poles, nodes,fat,fdt, fibers, fiberAttachments, showHandholes, showJoints, showCustomers, showPoles, showNodes,showFat, showFdt, showFibers, showFiberAttachments]);

//   return (
//     <MainLayout>
//       <div style={{ height: "78vh", width: "100%" }} ref={mapRef}></div>
//       {map && <FindRoute map={map} />}
//       <KarachiMapWidgets
     
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
//     </MainLayout>
//   );
// }


// // import { useEffect, useRef, useState } from "react";
// // import { Loader } from "@googlemaps/js-api-loader";
// // import { MarkerClusterer } from "@googlemaps/markerclusterer";

// // const GOOGLE_MAPS_API_KEY = "AIzaSyDB-6c4kivqz0O7sMvstfchTqBMAwXV-E8"; // Replace with your key
// // const AUTO_REFRESH_INTERVAL = 120000; // 2 minutes

// // export default function CustomerOnuMap() {
// //   const mapRef = useRef(null);
// //   const mapInstance = useRef(null);
// //   const markersRef = useRef([]);
// //   const infoWindowRef = useRef(null);

// //   const [customers, setCustomers] = useState([]);
// //   const [filters, setFilters] = useState({ ring: "All", city: "All", onuStatus: "All" });

// //   /* ---------------- FETCH DATA ---------------- */
// //   const fetchCustomers = async () => {
// //     try {
// //       const res = await fetch("http://localhost:3000/api/map/customers-onu");
// //       const data = await res.json();
// //       if (data.success) setCustomers(data.data);
// //     } catch (err) {
// //       console.error("Failed to fetch customer + ONU data:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCustomers();
// //     const interval = setInterval(fetchCustomers, AUTO_REFRESH_INTERVAL);
// //     return () => clearInterval(interval);
// //   }, []);

// //   /* ---------------- MAP INIT ---------------- */
// //   useEffect(() => {
// //     if (!customers.length) return;

// //     const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY, version: "weekly" });
// //     loader.load().then(() => {
// //       mapInstance.current = new window.google.maps.Map(mapRef.current, {
// //         center: { lat: 33.6844, lng: 73.0479 }, // Islamabad / Rawalpindi
// //         zoom: 11
// //       });

// //       infoWindowRef.current = new window.google.maps.InfoWindow();
// //       renderMarkers();
// //     });
// //   }, [customers]);

// //   /* ---------------- MARKER ICON LOGIC ---------------- */
// //   function getMarkerIcon(onu) {
// //     if (!onu) return "/icons/grey.png";
// //     if (onu.status === "Offline") return "/icons/red.png";
// //     const signal = parseFloat(onu.signal_1310);
// //     if (!isNaN(signal) && signal < -27) return "/icons/orange.png";
// //     return "/icons/green.png";
// //   }

// //   /* ---------------- FILTERED DATA ---------------- */
// //   const getFilteredCustomers = () => {
// //     return customers.filter(c => {
// //       const ringMatch = filters.ring === "All" || c.Ring_Name === filters.ring;
// //       const cityMatch = filters.city === "All" || c.City === filters.city;
// //       const statusMatch = filters.onuStatus === "All" || (c.onu?.status ?? "N/A") === filters.onuStatus;
// //       return ringMatch && cityMatch && statusMatch;
// //     });
// //   };

// //   /* ---------------- RENDER MARKERS ---------------- */
// // function renderMarkers() {
// //   // Remove old markers
// //   markersRef.current.forEach(m => m.setMap(null));
// //   markersRef.current = [];

// //   const filteredCustomers = getFilteredCustomers();

// //   // Create markers
// //  const markers = filteredCustomers
// //   .filter(c => c.Latitude && c.Longitude)
// //   .map(c => {
// //     const marker = new window.google.maps.Marker({
// //       position: { lat: Number(c.Latitude), lng: Number(c.Longitude) }, // ✅ ensure number
// //       icon: getMarkerIcon(c.onu),
// //       map: mapInstance.current,
// //       title: c.Customer_Name,
// //       animation: window.google.maps.Animation.DROP
// //     });

// //     marker.addListener("click", () => {
// //       infoWindowRef.current.setContent(`<div>${c.Customer_Name}</div>`);
// //       infoWindowRef.current.open({ anchor: marker, map: mapInstance.current });
// //     });

// //     return marker;
// //   });

// // new MarkerClusterer({ map: mapInstance.current, markers });
// // markersRef.current = markers;


// //   // ✅ Attach clusterer correctly with map
// //   new MarkerClusterer({ map: mapInstance.current, markers, gridSize: 60, minimumClusterSize: 2 });
// //   markersRef.current = markers;
// // }


// //   /* ---------------- FILTER HANDLERS ---------------- */
// //   const uniqueRings = ["All", ...new Set(customers.map(c => c.Ring_Name).filter(Boolean))];
// //   const uniqueCities = ["All", ...new Set(customers.map(c => c.City).filter(Boolean))];
// //   const uniqueStatus = ["All", ...new Set(customers.map(c => c.onu?.status ?? "N/A"))];

// //   const handleFilterChange = (e) => {
// //     setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
// //     setTimeout(renderMarkers, 100); // slight delay to update markers
// //   };

// //   return (
// //     <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
// //       {/* FILTER PANEL */}
// //       <div style={{ padding: "10px", background: "#f5f5f5", display: "flex", gap: "10px", flexWrap: "wrap" }}>
// //         <div>
// //           <label>Ring: </label>
// //           <select name="ring" value={filters.ring} onChange={handleFilterChange}>
// //             {uniqueRings.map(r => <option key={r} value={r}>{r}</option>)}
// //           </select>
// //         </div>
// //         <div>
// //           <label>City: </label>
// //           <select name="city" value={filters.city} onChange={handleFilterChange}>
// //             {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
// //           </select>
// //         </div>
// //         <div>
// //           <label>ONU Status: </label>
// //           <select name="onuStatus" value={filters.onuStatus} onChange={handleFilterChange}>
// //             {uniqueStatus.map(s => <option key={s} value={s}>{s}</option>)}
// //           </select>
// //         </div>
// //         <div style={{ marginLeft: "auto", display: "flex", gap: "5px", alignItems: "center" }}>
// //           <span style={{ width: 15, height: 15, background: "green", display: "inline-block" }}></span> Online
// //           <span style={{ width: 15, height: 15, background: "orange", display: "inline-block" }}></span> Weak
// //           <span style={{ width: 15, height: 15, background: "red", display: "inline-block" }}></span> Offline
// //           <span style={{ width: 15, height: 15, background: "grey", display: "inline-block" }}></span> No ONU
// //         </div>
// //       </div>

// //       {/* MAP */}
// //       <div ref={mapRef} style={{ flex: 1 }} />
// //     </div>
// //   );
// // }








// // src/components/Dashboard.jsx

// // import React, { useState, useEffect, useMemo } from 'react';
// // import axios from 'axios';
// // import { Link } from 'react-router-dom'; // Assuming you use React Router

// // const BACKEND_URL = 'http://localhost:3000';

// // // Helper component for the KPI boxes
// // const KpiCard = ({ title, value, color, icon }) => (
// //     <div className={`p-5 rounded-lg shadow-lg bg-gray-800 border-l-4 ${color}`}>
// //         <div className="text-sm font-medium text-gray-400">{title}</div>
// //         <div className="flex items-center justify-between mt-1">
// //             <div className="text-3xl font-bold text-white">{value}</div>
// //             <div className="text-2xl text-gray-500">{icon}</div>
// //         </div>
// //     </div>
// // );

// // // Helper function to calculate KPIs
// // const calculateKpis = (data) => {
// //     let total = data.length;
// //     let online = 0;
// //     let offline = 0;
// //     let poorSignal = 0;

// //     data.forEach(item => {
// //         if (item.onu) {
// //             if (item.onu.status === 'Online') {
// //                 online++;
// //             } else if (item.onu.status === 'Offline') {
// //                 offline++;
// //             }
// //             // Simple check for poor signal (e.g., Rx power worse than -27 dBm)
// //             const rxPower = parseFloat(item.onu.signal_1490);
// //             if (!isNaN(rxPower) && rxPower < -27) {
// //                 poorSignal++;
// //             }
// //         }
// //     });

// //     return { total, online, offline, poorSignal };
// // };


// // const Dashboard = () => {
// //     const [customers, setCustomers] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [searchTerm, setSearchTerm] = useState('');

// //     // 🔑 Fetch the bulk/cached data from your merged API endpoint
// //     useEffect(() => {
// //         const fetchMergedData = async () => {
// //             try {
// //                 const response = await axios.get(`${BACKEND_URL}/api/map/customers-onu`);
// //                 setCustomers(response.data.data);
// //             } catch (error) {
// //                 console.error("Error fetching merged data:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };
// //         fetchMergedData();
// //     }, []);

// //     // 💡 Memoize the KPI calculation for performance
// //     const kpis = useMemo(() => calculateKpis(customers), [customers]);

// //     // 🔍 Filter the customer list based on the search term
// //     const filteredCustomers = useMemo(() => {
// //         const lowerCaseSearch = searchTerm.toLowerCase();
// //         return customers.filter(c =>
// //             c.Customer_Name?.toLowerCase().includes(lowerCaseSearch) ||
// //             c.Customer_ID?.toString().includes(lowerCaseSearch) ||
// //             c.OLT_Name?.toLowerCase().includes(lowerCaseSearch)
// //         );
// //     }, [customers, searchTerm]);

// //     if (loading) {
// //         return <div className="text-center text-lg mt-10">Loading Dashboard Data...</div>;
// //     }

// //     return (
// //         <div className="p-8 bg-gray-900 min-h-screen text-white">
// //             <h1 className="text-4xl font-extrabold mb-8 text-indigo-400">Network Operations Dashboard 🌐</h1>
            
// //             {/* 1. KPI Bar */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
// //                 <KpiCard title="Total Customers" value={kpis.total} color="border-indigo-500" icon="👥" />
// //                 <KpiCard title="Online ONUs" value={kpis.online} color="border-green-500" icon="🟢" />
// //                 <KpiCard title="Offline ONUs" value={kpis.offline} color="border-red-500" icon="🔴" />
// //                 <KpiCard title="Poor Signal Alerts" value={kpis.poorSignal} color="border-yellow-500" icon="⚠️" />
// //             </div>

// //             <hr className="my-8 border-gray-700" />
            
// //             {/* 2. Search and Table */}
// //             <h2 className="text-2xl font-semibold mb-4 text-gray-200">Customer & ONU Status List</h2>
// //             <input
// //                 type="text"
// //                 placeholder="Search by Name, ID, or OLT..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full p-3 mb-6 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
// //             />

// //             <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
// //                 <table className="min-w-full divide-y divide-gray-700">
// //                     <thead className="bg-gray-700">
// //                         <tr>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer ID</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer Name</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">OLT Name</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ONU Status</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Signal Health</th>
// //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody className="divide-y divide-gray-700">
// //                         {filteredCustomers.map((customer) => {
// //                             const onuStatus = customer.onu?.status || 'N/A';
// //                             const signalHealth = customer.onu?.signal || 'N/A';
                            
// //                             // Conditional styling for ONU Status
// //                             const statusColor = onuStatus === 'Online' ? 'text-green-400' : 
// //                                                 onuStatus === 'Offline' ? 'text-red-400' : 'text-yellow-400';

// //                             return (
// //                                 <tr key={customer.OBJECTID} className="hover:bg-gray-700 transition duration-150">
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">{customer.Customer_ID}</td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{customer.Customer_Name}</td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.OLT_Name}</td>
// //                                     <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${statusColor}`}>{onuStatus}</td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{signalHealth}</td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm">
// //                                         <Link 
// //                                             to={`/customer/${customer.Customer_ID}`} 
// //                                             className="text-indigo-400 hover:text-indigo-300 font-semibold"
// //                                         >
// //                                             View Live Status
// //                                         </Link>
// //                                     </td>
// //                                 </tr>
// //                             );
// //                         })}
// //                     </tbody>
// //                 </table>
// //             </div>

// //             {/* Placeholder for Map and Charts would go here */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
// //                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl"><h3 className="text-xl font-semibold mb-3 text-gray-200">OLT Distribution (Chart Placeholder)</h3></div>
// //                 <div className="bg-gray-800 p-6 rounded-lg shadow-xl"><h3 className="text-xl font-semibold mb-3 text-gray-200">Geospatial Map (Placeholder)</h3></div>
// //             </div>

// //         </div>
// //     );
// // };

// // export default Dashboard;











// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Search, Signal, Wifi, WifiOff, AlertCircle, Loader2, Eye } from "lucide-react";

// // const API_BASE = "http://localhost:3000/api";

// // function App() {
// //   const [data, setData] = useState([]);           // merged customers + onu
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");
// //   const [selectedCustomer, setSelectedCustomer] = useState(null);
// //   const [liveStatus, setLiveStatus] = useState(null);
// //   const [liveLoading, setLiveLoading] = useState(false);

// //   // Fetch merged data on mount
// //   useEffect(() => {
// //     fetchMergedData();
// //     const interval = setInterval(fetchMergedData, 5 * 60 * 1000); // refresh every 5 mins
// //     return () => clearInterval(interval);
// //   }, []);

// //   const fetchMergedData = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await axios.get(`${API_BASE}/map/customers-onu`);
// //       setData(res.data.data);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to load data. Is backend running?");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchLiveStatus = async (customerId) => {
// //     setLiveLoading(true);
// //     try {
// //       const res = await axios.get(`${API_BASE}/onu/live-status/${customerId}`);
// //       setLiveStatus(res.data.data);
// //     } catch (err) {
// //       setLiveStatus({ error: "Failed to fetch live status" });
// //     } finally {
// //       setLiveLoading(false);
// //     }
// //   };

// //  const filtered = data.filter(item => {
// //   const searchLower = search.toLowerCase();
  
// //   return (
// //     String(item.Customer_ID || "").includes(search) ||
// //     String(item.Customer_Name || "").toLowerCase().includes(searchLower) ||
// //     String(item.Mobile_No || "").includes(search)
// //   );
// // });

// //   const getSignalColor = (signal) => {
// //     if (!signal || signal === "N/A") return "text-gray-400";
// //     const s = parseFloat(signal);
// //     if (s >= -25) return "text-green-500";
// //     if (s >= -30) return "text-yellow-500";
// //     return "text-red-500";
// //   };

// //   return (
// //     <>
// //       <div className="min-h-screen bg-gray-50">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
// //           <div className="max-w-7xl mx-auto px-4 py-6">
// //             <h1 className="text-3xl font-bold flex items-center gap-3">
// //               <Wifi className="w-10 h-10" />
// //               SmartOLT Customer Dashboard
// //             </h1>
// //             <p className="mt-1 opacity-90">Real-time ONU status & customer mapping</p>
// //           </div>
// //         </div>

// //         <div className="max-w-7xl mx-auto px-4 py-8">
// //           {/* Search Bar */}
// //           <div className="mb-8">
// //             <div className="relative">
// //               <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search by Customer ID, Name, Mobile..."
// //                 className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //               />
// //             </div>
// //             <p className="mt-2 text-sm text-gray-600">
// //               Showing {filtered.length} of {data.length} customers
// //             </p>
// //           </div>

// //           {/* Loading State */}
// //           {loading ? (
// //             <div className="flex items-center justify-center py-20">
// //               <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
// //               <span className="ml-3 text-xl">Loading customer data...</span>
// //             </div>
// //           ) : (
// //             /* Customer Grid */
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
// //               {filtered.map((customer) => {
// //                 const onu = customer.onu;
// //                 const isOnline = onu?.status === "online" || onu?.online === "1";
// //                 const signal = onu?.rx_power_olt || onu?.signal || "N/A";

// //                 return (
// //                   <div
// //                     key={customer.Customer_ID}
// //                     className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 ${
// //                       isOnline ? "border-green-500" : "border-red-500"
// //                     } p-5 cursor-pointer`}
// //                     onClick={() => {
// //                       setSelectedCustomer(customer);
// //                       fetchLiveStatus(customer.Customer_ID);
// //                     }}
// //                   >
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div>
// //                         <h3 className="font-bold text-lg text-gray-800">
// //                           {customer.Customer_Name || "Unnamed"}
// //                         </h3>
// //                         <p className="text-2xl font-mono font-bold text-indigo-600">
// //                           {customer.Customer_ID}
// //                         </p>
// //                       </div>
// //                       <div className={`p-2 rounded-lg ${isOnline ? "bg-green-100" : "bg-red-100"}`}>
// //                         {isOnline ? (
// //                           <Wifi className="w-6 h-6 text-green-600" />
// //                         ) : (
// //                           <WifiOff className="w-6 h-6 text-red-600" />
// //                         )}
// //                       </div>
// //                     </div>

// //                     <div className="space-y-2 text-sm">
// //                       <p className="text-gray-600">
// //                         <strong>Mobile:</strong> {customer.Mobile_No || "-"}
// //                       </p>
// //                       <p className="text-gray-600">
// //                         <strong>Package:</strong> {customer.Package_Name || "-"}
// //                       </p>
// //                       <p className="text-gray-600">
// //                         <strong>OLT/ONU:</strong> {onu?.olt_name || "-"} / {onu?.name || "-"}
// //                       </p>
// //                     </div>

// //                     <div className="mt-4 pt-3 border-t flex items-center justify-between">
// //                       <div className="flex items-center gap-2">
// //                         <Signal className={`w-5 h-5 ${getSignalColor(signal)}`} />
// //                         <span className={`font-bold text-lg ${getSignalColor(signal)}`}>
// //                           {signal} dBm
// //                         </span>
// //                       </div>
// //                       <Eye className="w-5 h-5 text-gray-400" />
// //                     </div>

// //                     <div className="mt-2 text-xs text-gray-500">
// //                       {isOnline ? "Online" : "Offline"} •{" "}
// //                       {onu?.last_up_time ? new Date(onu.last_up_time).toLocaleString() : "Never"}
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           )}

// //           {/* Live Status Modal */}
// //           {selectedCustomer && (
// //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //               <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
// //                 <div className="p-6">
// //                   <div className="flex justify-between items-center mb-6">
// //                     <h2 className="text-2xl font-bold">
// //                       Live Status - {selectedCustomer.Customer_ID}
// //                     </h2>
// //                     <button
// //                       onClick={() => {
// //                         setSelectedCustomer(null);
// //                         setLiveStatus(null);
// //                       }}
// //                       className="text-gray-500 hover:text-gray-700 text-3xl"
// //                     >
// //                       ×
// //                     </button>
// //                   </div>

// //                   <div className="space-y-4">
// //                     <p className="text-lg">
// //                       <strong>{selectedCustomer.Customer_Name}</strong> ({selectedCustomer.Mobile_No})
// //                     </p>

// //                     {liveLoading ? (
// //                       <div className="flex items-center gap-3 py-8">
// //                         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
// //                         <span>Fetching live ONU status...</span>
// //                       </div>
// //                     ) : liveStatus?.error ? (
// //                       <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
// //                         <AlertCircle className="w-6 h-6" />
// //                         {liveStatus.error}
// //                       </div>
// //                     ) : liveStatus ? (
// //                       <div className="grid grid-cols-2 gap-4 text-sm">
// //                         <div className="bg-gray-50 p-4 rounded-lg">
// //                           <p className="text-gray-600">Status</p>
// //                           <p className={`text-2xl font-bold ${liveStatus.onu?.online === "1" ? "text-green-600" : "text-red-600"}`}>
// //                             {liveStatus.onu?.online === "1" ? "ONLINE" : "OFFLINE"}
// //                           </p>
// //                         </div>
// //                         <div className="bg-gray-50 p-4 rounded-lg">
// //                           <p className="text-gray-600">Signal (Rx)</p>
// //                           <p className={`text-2xl font-bold ${getSignalColor(liveStatus.onu?.rx_power_olt)}`}>
// //                             {liveStatus.onu?.rx_power_olt || "N/A"} dBm
// //                           </p>
// //                         </div>
// //                         <div className="bg-gray-50 p-4 rounded-lg">
// //                           <p className="text-gray-600">Tx Power</p>
// //                           <p className="text-xl font-semibold">
// //                             {liveStatus.onu?.tx_power_onu || "N/A"} dBm
// //                           </p>
// //                         </div>
// //                         <div className="bg-gray-50 p-4 rounded-lg">
// //                           <p className="text-gray-600">Distance</p>
// //                           <p className="text-xl font-semibold">
// //                             {liveStatus.onu?.distance || "N/A"} m
// //                           </p>
// //                         </div>
// //                         <div className="bg-gray-50 p-4 rounded-lg col-span-2">
// //                           <p className="text-gray-600">Last Seen</p>
// //                           <p className="text-lg font-mono">
// //                             {liveStatus.onu?.last_up_time
// //                               ? new Date(liveStatus.onu.last_up_time).toLocaleString()
// //                               : "Never"}
// //                           </p>
// //                         </div>
// //                       </div>
// //                     ) : null}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // export default App;


import { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import handholeIcon from "../../public/images/repair.png";
import jointsIcon from "../../public/images/tie.png";
import customerIcon from "../../public/images/customers.png";
import nodeIcon from "../../public/images/antenna-tower-unscreen.gif";
import fatIcon from "../../public/images/splitter.png"; // Import customer icon
import poleIcon from "../../public/images/poll.png"; // Import customer icon
import fdtIcon from "../../public/images/optical-fiber.png"; // Import customer icon
import KarachiMapWidgets from "./KarachiMapWidgets";
// NOTE: Assuming KarachiMap.css exists for styling, if not, you'd need to create one.

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

    fetchData("http://103.31.83.47:5000/api/handholes", setHandholes, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/joints", setJoints, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/customers", setCustomers, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/poles", setPoles, parsePoles);

    fetchData("http://103.31.83.47:5000/api/fat", setFat, parseFat);
    fetchData("http://103.31.83.47:5000/api/fdt", setFdt, parseFdt);

    fetchData("http://103.31.83.47:5000/api/nodes", setNodes, parseCoordinates);
    fetchData("http://103.31.83.47:5000/api/metrofiber", setFibers, parseFiber);
    fetchData("http://103.31.83.47:5000/api/faRoutes", setFiberAttachments, parseFiberAttachment);
  }, []);

  // Map Initialization
  useEffect(() => {
    loadGoogleMapsScript(() => {
      const Rawalpindi = { lat: 24.8607, lng:  67.0011 };
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: Rawalpindi,
        zoom: 12,
      
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
          icon: { url: customerIcon, scaledSize: new window.google.maps.Size(18, 18) },
        });
        marker.addListener("click", () => {
          const html = buildInfoCard({
            title: `Customer #${c.Customer_Name || c.Customer_ID}`,
            tag: "Customer",
            image: c.Image_URL || "https://placehold.co/280x160/FF0000/FFFFFF?text=Customer",
            list: [
              { icon: "🆔", label: "Customer ID", value: c.Customer_ID },
              { icon: "🏢", label: "OLT_Name", value: c.OLT_Name },
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
          title: `OLT: ${n.OLT_Name}`,
          icon: { url: nodeIcon, scaledSize: new window.google.maps.Size(55, 55) },
        });
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
        scaledSize: new window.google.maps.Size(20, 20),
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
    
        // Store default color per polyline
        defaultFiberColors.set(polyline, { color: fiberColor, weight: 4 });
    
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
              });
            }
          }
    
          // Highlight clicked line
          polyline.setOptions({
            strokeColor: "#00fff7",
            strokeWeight: 8,
            zIndex: 999,
          });
          currentHighlightedFiberRef.current = polyline;
    
          // Build left-panel content
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
            ? "#0000FF"
            : fa.Connectivity_Type === "Buried"
            ? "#00FF99"
            : "#4285F4";
    
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
    

  }, [map, handholes, joints, customers, poles, nodes,fat,fdt, fibers, fiberAttachments, showHandholes, showJoints, showCustomers, showPoles, showNodes,showFat, showFdt, showFibers, showFiberAttachments]);

  return (
    <MainLayout>
      <div style={{ height: "78vh", width: "100%" }} ref={mapRef}></div>
      <KarachiMapWidgets
     
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
    setShowFat={ setShowFat}            
    showFdt={showFdt}
    setShowFdt={setShowFdt}             
    showFibers={showFibers}
    setShowFibers={setShowFibers}
        fiberAttachments={fiberAttachments}
        showFiberAttachments={showFiberAttachments}
        setShowFiberAttachments={setShowFiberAttachments}
      />
    </MainLayout>
  );
}

