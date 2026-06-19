import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import handholeIcon from "/images/repair.png"
import jointsIcon from "/images/tie.png"
import nodeIcon from "/images/nodeTower.gif"
import MapSectionWidgets from "./MapSectionWidgets";
import customerIcon from "../../../public/images/customers.png";
import "./MapSection.css";

// ⬅️ UPDATED: Get environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;
const DARK_MAP_ID = 'custom_dark_mode';

// 🛑 GLOBAL STATE FOR HIGHLIGHT TRACKING: Used to manage the single, currently highlighted fiber.
// This must be global/external because MapSectionWidgets needs to access the clear function
// even when MapSection is not actively running its effects.
let currentHighlightedFiberRef = { current: null };
const defaultFiberColors = new Map();


// =================================================================
// 🛑 INFO WINDOW CONTENT FUNCTIONS (Defined globally for accessibility)
// =================================================================

const handholeInfoWindowContent = (hh, imageUrl) => `
      <div class="info-window-card" style="width: 240px; background: #0F2A4D;">
        <h3 style="font-size:16px;font-weight:bold;color:#00E5FF;margin-bottom:6px;">
          Handhole Info
        </h3>
        <table class="info-window-table">
          <tr><td class="info-window-td"><strong>ID:</strong></td><td>${hh.HH_ID || "N/A"}</td></tr>
          <tr><td class="info-window-td"><strong>Ring:</strong></td><td>${hh.Ring_Name || "N/A"}</td></tr>
          <tr><td class="info-window-td"><strong>Condition:</strong></td><td>${hh.Condition || "N/A"}</td></tr>
        </table>

        <img
          src="${imageUrl}"
          alt="Handhole Image"
          class="info-window-img"
          onclick="(function(){ /* ... lightbox logic ... */ })()"
        />
      </div>
    `;

const jointInfoWindowContent = (j) => `
      <div class="info-window-card">
        <h3 class="info-window-heading">Joint - ${j.Joint_ID || 'N/A'}</h3>
        <table class="info-window-table">
 <tr><td class="info-window-td"><strong>Type:</strong></td><td>${j.Joint_Type || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Connectivity:</strong></td><td>${j.Connectivity_Type || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Ring:</strong></td><td>${j.Ring_Name || 'N/A'}</td></tr>
        </table>
      </div>                                                                      
    `;

const nodeInfoWindowContent = (n, imageUrl) => `
      <div class="info-window-card">
        <h3 class="info-window-heading">Node - ${n.OLT_Name || 'N/A'}</h3>
        <table class="info-window-table">
          <tr><td class="info-window-td"><strong>Latitude:</strong></td><td>${n.Latitude || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Longitude:</strong></td><td>${n.Longitude || 'N/A'}</td></tr>
        </table>
        <img src="${imageUrl}" class="info-window-img" style="margin-top:10px;" />
      </div>
    `;

const customersInfoWindowContent = (n, imageUrl) => `
      <div class="info-window-card">
        <h3 class="info-window-heading">Customers - ${n.Customer_ID || 'N/A'}</h3>
        <table class="info-window-table">
          <tr><td class="info-window-td"><strong>Latitude:</strong></td><td>${n.Latitude || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Longitude:</strong></td><td>${n.Longitude || 'N/A'}</td></tr>
        </table>
       
      </div>
    `;

const fiberInfoWindowContent = (f) => `
      <div class="info-window-card">
        <h3 class="info-window-heading">Core No - ${f.Core_No || 'N/A'}</h3>
        <table class="info-window-table">
          <tr><td class="info-window-td"><strong>FOC ID:</strong></td><td>${f.FOC_ID || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Length (m):</strong></td><td>${f.Calculated_Length || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Connectivity:</strong></td><td>${f.Connectivity_Type || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Ring:</strong></td><td>${f.Ring_Name || 'N/A'}</td></tr>
          <tr><td class="info-window-td"><strong>Region:</strong></td><td>${f.Region || 'N/A'}</td></tr>
        </table>
      </div>
    `;


// =================================================================
// 🛑 CUSTOM HOOK: useFiberHighlight
// This hook encapsulates the highlighting logic and guarantees access 
// to the latest map/infoWindow refs/state.
// =================================================================

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

        // 1. Clear any previously highlighted fiber
        clearFiberHighlights();

        // 2. Highlight the new polyline
        polyline.setOptions({
            strokeColor: '#00fff7ff', // Bright Yellow
            strokeWeight: 8,
            zIndex: 999,
        });

        // 3. Store the new highlighted polyline
        currentHighlightedFiberRef.current = polyline;

        // 4. Set InfoWindow Content and Position
        const content = fiberInfoWindowContent(fiberData);
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.setPosition(clickPosition);
        infoWindowRef.current.open(map);

        // 5. Center map on the click point
        map.panTo(clickPosition);
    };

    // Expose the cleanup function globally (for MapSectionWidgets)
    useEffect(() => {
        window.clearFiberHighlights = clearFiberHighlights;
    }, [map, infoWindowRef]);

    return { highlightFiber, clearFiberHighlights };
}


// =================================================================
// 🛑 MAIN COMPONENT: MapSection
// =================================================================

export default function MapSection() {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);

    const [handholes, setHandholes] = useState([]);
    const [joints, setJoints] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [fibers, setFibers] = useState([]);

    const [showHandholes, setShowHandholes] = useState(true);
    const [showJoints, setShowJoints] = useState(true);
    const [showNodes, setShowNodes] = useState(true);
    const [showCustomers, setShowCustomers] = useState(true);
    const [showFibers, setShowFibers] = useState(true);
    const [widgetOpen, setWidgetOpen] = useState(false);

    const handholeMarkersRef = useRef([]);
    const jointsMarkersRef = useRef([]);
    const nodesMarkersRef = useRef([]);
    const customersMarkersRef = useRef([]);
    const fiberLinesRef = useRef([]);
    const infoWindowRef = useRef(null);

    const handholeClusterRef = useRef(null);
    const jointsClusterRef = useRef(null);
    const customerClusterRef = useRef(null);

    // 🛑 USE THE HOOK: Get the highlight functions
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
                const cleaned = data
                    .map(parser)
                    .filter((item) => item && item.Latitude !== undefined && item.Longitude !== undefined);
                setData(cleaned.filter(Boolean));
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
            }
        };

        fetchData(`${API_BASE_URL}/n_handholes`, setHandholes, (hh) => ({ ...hh, Latitude: parseFloat(hh.Latitude), Longitude: parseFloat(hh.Longitude), }))
        fetchData(`${API_BASE_URL}/n_joints`, setJoints, (j) => ({ ...j, Latitude: parseFloat(j.Latitude), Longitude: parseFloat(j.Longitude), }));
        fetchData(`${API_BASE_URL}/n_nodes`, setNodes, (n) => ({ ...n, Latitude: parseFloat(n.Latitude), Longitude: parseFloat(n.Longitude), }));
        fetchData(`${API_BASE_URL}/n_customers`, setCustomers, (n) => ({ ...n, Latitude: parseFloat(n.Latitude), Longitude: parseFloat(n.Longitude), }));

        // Core Network
        fetchData(`${API_BASE_URL}/n_metroFiber`, setFibers, (f) => {
            if (!f.SHAPE || !f.SHAPE.points) return null;
            const path = f.SHAPE.points.map((pt) => ({
                lat: parseFloat(pt.y),
                lng: parseFloat(pt.x),
            }));
            return { ...f, path, Latitude: path[0]?.lat, Longitude: path[0]?.lng };
        });

    }, []);

    // Map Initialization
    useEffect(() => {
        loadGoogleMapsScript(() => {
            const karachi = { lat: 30.3753, lng: 69.3451 };
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: karachi,
                zoom: 5,
                mapTypeControl: false,
                streetViewControl: false,
                mapTypeId: DARK_MAP_ID,
            });
            setMap(mapInstance);
        });
    }, []);


    // InfoWindow & Marker Rendering Logic
    useEffect(() => {
        if (!map) return;

        // Initialize InfoWindow
        if (!infoWindowRef.current)
            infoWindowRef.current = new window.google.maps.InfoWindow();

        // clear old markers and lines
        [...handholeMarkersRef.current, ...jointsMarkersRef.current, ...nodesMarkersRef.current, ...customersMarkersRef.current].forEach((m) => m.setMap(null));
        fiberLinesRef.current.forEach((line) => line.setMap(null));

        // Reset highlights and color map on re-render
        clearFiberHighlights();
        defaultFiberColors.clear();

        handholeMarkersRef.current = [];
        jointsMarkersRef.current = [];
        nodesMarkersRef.current = [];
        customersMarkersRef.current = [];
        fiberLinesRef.current = [];

        if (handholeClusterRef.current) handholeClusterRef.current.clearMarkers();
        if (jointsClusterRef.current) jointsClusterRef.current.clearMarkers();
        if (customerClusterRef.current) customerClusterRef.current.clearMarkers();


        // 🟢 Handholes
        if (showHandholes) {
            const markers = handholes.map((hh) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: hh.Latitude, lng: hh.Longitude },
                    title: `Handhole: ${hh.HH_ID}`,
                    icon: { url: handholeIcon, scaledSize: new window.google.maps.Size(18, 18) },
                });

                marker.addListener("click", () => {
                    const imageUrl = hh.Image_URL || "https://via.placeholder.com/220x120?text=No+Image";

                    // Define the self-contained JavaScript function for creating the lightbox modal.
                    // This must be injected into the onclick attribute as a single string.
                    const lightboxClickScript = `
          (function(url) {
            // Check if the modal is already open
            if (document.getElementById('image-lightbox-modal')) return;

            // 1. Create Modal Overlay (Lightbox)
            const modal = document.createElement('div');
            modal.id = 'image-lightbox-modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.95); display: flex; justify-content: center; align-items: center; z-index: 10000; cursor: pointer; transition: opacity 0.3s; opacity: 0;';

            // 2. Create Image Element
            const img = document.createElement('img');
            img.src = url;
            img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 12px; box-shadow: 0 0 50px rgba(255, 255, 255, 0.2);';

            // 3. Create Close Button (using &times; character)
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = 'position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px; font-weight: bold; cursor: pointer; user-select: none;';

            // 4. Define Close Function
            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300); // Wait for fade-out before removal
            };

            // 5. Append elements and attach events
            modal.appendChild(img);
            modal.appendChild(closeBtn);
            
            // Close when clicking the overlay or close button
            modal.onclick = (e) => { 
                if (e.target === modal || e.target === img || e.target === closeBtn) {
                    closeModal(); 
                }
            };
            closeBtn.onclick = closeModal;

            // 6. Add to body and fade in
            document.body.appendChild(modal);
            // Small timeout to enable CSS transition for fade-in effect
            setTimeout(() => modal.style.opacity = '1', 10);
          })('${imageUrl}');
        `;

                    // NOTE: Using the complex HTML from the original component for Handholes
                    infoWindowRef.current.setContent(`
          <div style="font-family: Arial; padding: 12px; border-radius: 12px; background: #0F2A4D; box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: white; width: 240px;">
              <h3 style="font-size:16px;font-weight:bold;color:#00E5FF;margin-bottom:6px;">Handhole Info</h3>
              <table style="width:100%;font-size:13px;margin-bottom:8px;">
                  <tr><td><strong>ID:</strong></td><td>${hh.HH_ID || "N/A"}</td></tr>
                  <tr><td><strong>Ring:</strong></td><td>${hh.Ring_Name || "N/A"}</td></tr>
                  <tr><td><strong>Condition:</strong></td><td>${hh.Condition || "N/A"}</td></tr>
              </table>
              <img
                  src="${imageUrl}"
                  alt="Handhole Image"
                  style="width:100%; max-height:120px; object-fit:cover; border-radius:8px; margin-top:6px; cursor:pointer; transition:transform 0.2s ease;"
                  onclick="${lightboxClickScript}"
              />
          </div>
        `);
                    infoWindowRef.current.open(map, marker);
                });
                return marker;
            });
            handholeMarkersRef.current = markers;
            handholeClusterRef.current = new MarkerClusterer({ map, markers });
        }

        // 🔴 Joints
        if (showJoints) {
            const markers = joints.map((j) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: j.Latitude, lng: j.Longitude },
                    title: `Joint: ${j.Joint_ID}`,
                    icon: { url: jointsIcon, scaledSize: new window.google.maps.Size(18, 18) },
                });
                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(jointInfoWindowContent(j));
                    infoWindowRef.current.open(map, marker);
                });
                return marker;
            });
            jointsMarkersRef.current = markers;
            jointsClusterRef.current = new MarkerClusterer({ map, markers });
        }

        // 🟣 Nodes
        if (showNodes) {
            nodes.forEach((n) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: n.Latitude, lng: n.Longitude },
                    map,
                    title: `Node: ${n.OLT_Name}`,
                    icon: { url: nodeIcon, scaledSize: new window.google.maps.Size(40, 40) },
                });
                marker.addListener("click", () => {
                    const imageUrl = n.Image_URL || "https://via.placeholder.com/220x120?text=No+Image";

                    // This must be injected into the onclick attribute as a single string.
                    const lightboxClickScript = `
           (function(url) {
             // Check if the modal is already open
             if (document.getElementById('image-lightbox-modal')) return;
 
             // 1. Create Modal Overlay (Lightbox)
             const modal = document.createElement('div');
             modal.id = 'image-lightbox-modal';
             modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.95); display: flex; justify-content: center; align-items: center; z-index: 10000; cursor: pointer; transition: opacity 0.3s; opacity: 0;';
 
             // 2. Create Image Element
             const img = document.createElement('img');
             img.src = url;
             img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 12px; box-shadow: 0 0 50px rgba(255, 255, 255, 0.2);';
 
             // 3. Create Close Button (using &times; character)
             const closeBtn = document.createElement('div');
             closeBtn.innerHTML = '&times;';
             closeBtn.style.cssText = 'position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px; font-weight: bold; cursor: pointer; user-select: none;';
 
             // 4. Define Close Function
             const closeModal = () => {
                 modal.style.opacity = '0';
                 setTimeout(() => modal.remove(), 300); // Wait for fade-out before removal
             };
 
             // 5. Append elements and attach events
             modal.appendChild(img);
             modal.appendChild(closeBtn);
             
             // Close when clicking the overlay or close button
             modal.onclick = (e) => { 
                 if (e.target === modal || e.target === img || e.target === closeBtn) {
                     closeModal(); 
                 }
             };
             closeBtn.onclick = closeModal;
 
             // 6. Add to body and fade in
             document.body.appendChild(modal);
             // Small timeout to enable CSS transition for fade-in effect
             setTimeout(() => modal.style.opacity = '1', 10);
           })('${imageUrl}');
         `;



                    infoWindowRef.current.setContent(`
                     <div style="${cardStyle}">
                         <h3 style="${headingStyle}">Node - ${n.OLT_Name || 'N/A'}</h3>
                         <table style="${tableStyle}">
                             <tr><td style="${tdStyle}"><strong>Latitude:</strong></td><td>${n.Latitude || 'N/A'}</td></tr>
                             <tr><td style="${tdStyle}"><strong>Longitude:</strong></td><td>${n.Longitude || 'N/A'}</td></tr>
                         </table>
                          <img
                   src="${imageUrl}"
                   alt="Handhole Image"
                   style="width:100%; max-height:120px; object-fit:cover; border-radius:8px; margin-top:6px; cursor:pointer; transition:transform 0.2s ease;"
                   onclick="${lightboxClickScript}"
               />
                     </div>
                 `);
                    infoWindowRef.current.open(map, marker);
                });
                nodesMarkersRef.current.push(marker);
            });
        }

        // 🟣 customers
        if (showCustomers) {
            const markers = customers.map((c) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: c.Latitude, lng: c.Longitude },
                    title: `Customers: ${c.Customer_ID}`,
                    icon: { url: customerIcon, scaledSize: new window.google.maps.Size(18, 18) },
                });
                marker.addListener("click", () => {
                    infoWindowRef.current.setContent(customersInfoWindowContent(c));
                    infoWindowRef.current.open(map, marker);
                });
                return marker;
            });
            customersMarkersRef.current = markers;
            customerClusterRef.current = new MarkerClusterer({ map, markers });
        }

        // 🧵 Core Network
        if (showFibers) {
            fibers.forEach((f) => {
                const fiberColor =
                    f.Connectivity_Type === "Aerial" ? "#007BFF" :
                        f.Connectivity_Type === "Buried" ? "#00FF99" :
                            "#FF3B30";

                const polyline = new window.google.maps.Polyline({
                    path: f.path,
                    geodesic: true,
                    strokeColor: fiberColor,
                    strokeOpacity: 0.9,
                    strokeWeight: 4,
                    map,
                });

                // Store the default color and weight
                defaultFiberColors.set(polyline, { color: fiberColor, weight: 4 });

                // 🛑 CLICK LISTENER: Calls the highlight function from the custom hook
                polyline.addListener("click", (e) => {
                    highlightFiber(polyline, f, e.latLng);
                });
                fiberLinesRef.current.push(polyline);
            });
        }
    }, [map, handholes, joints, nodes, customers, fibers, showHandholes, showJoints, showNodes, showCustomers, showFibers, highlightFiber, clearFiberHighlights]);

    return (
        <div>
            <div ref={mapRef} className="map-container" />
            <MapSectionWidgets
                map={map}
                handholes={handholes}
                joints={joints}
                nodes={nodes}
                customers={customers}
                fibers={fibers}
                widgetOpen={widgetOpen}
                setWidgetOpen={setWidgetOpen}
                showHandholes={showHandholes}
                setShowHandholes={setShowHandholes}
                showJoints={showJoints}
                setShowJoints={setShowJoints}
                showNodes={showNodes}
                setShowNodes={setShowNodes}
                showCustomers={showCustomers}
                setShowCustomers={setShowCustomers}
                showFibers={showFibers}
                setShowFibers={setShowFibers}
            />
        </div>
    );
}