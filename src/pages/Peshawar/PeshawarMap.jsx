import { useEffect, useRef, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import handholeIcon from "../../../public/images/repair.png"
import jointsIcon from "../../../public/images/tie.png"
import customerIcon from "../../../public/images/customers.png" 
import nodeIcon from "../../../public/images/antenna-tower-unscreen.gif";
import PeshawarMapWidgets from "./PeshawarMapWidgets";
import poleIcon from "../../../public/images/poll.png";
import fdtIcon from "../../../public/images/fdt.gif";
import fatIcon from "../../../public/images/splitter.png";
import LayerListPanel from "./LayerListPanel";                                                                                                       

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
    fetchData("http://localhost:5000/api/p_handhole", setHandholes, parseCoordinates);
    fetchData("http://localhost:5000/api/p_joints", setJoints, parseCoordinates);
    fetchData("http://localhost:5000/api/p_customers", setCustomers, parseCoordinates);
    fetchData("http://localhost:5000/api/p_poles", setPoles, parsePoles);

    fetchData("http://localhost:5000/api/p_fat_splitter", setFat, parseFat);
    fetchData("http://localhost:5000/api/p_fdtPon", setFdt, parseFdt);

    fetchData("http://localhost:5000/api/p_nodes", setNodes, parseCoordinates);
    fetchData("http://localhost:5000/api/p_metroFiber", setFibers, parseFiber);
    fetchData("http://localhost:5000/api/p_fiberattachment", setFiberAttachments, parseFiberAttachment);
  }, []);

  // Map Initialization
   useEffect(() => {
    loadGoogleMapsScript(() => {
      const Peshawar = { lat: 34.0083, lng: 71.5189 };                                                                
      // const mapInstance = new window.google.maps.Map(mapRef.current, {
      //   center: Rawalpindi,
      //   zoom: 12,
      //   mapTypeControl: false,
      //   streetViewControl: false,
      // });
      const mapInstance = new window.google.maps.Map(mapRef.current, {
  center: Peshawar,
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
          title: `Node: ${n.OLT_Name}`,
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
        ? "#3cff00"        // Light Green
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
        ? "#3cff00"
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

      <LayerListPanel
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
            showFiberAttachments={showFiberAttachments}
            setShowFiberAttachments={setShowFiberAttachments}
          />
      <PeshawarMapWidgets
     
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
