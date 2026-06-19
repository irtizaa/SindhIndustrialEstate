import React, { useEffect, useRef, useState } from "react";
import handholeIcon from "/images/repair.png";
import jointsIcon from "/images/tie.png";
import nodeIcon from "/images/antenna-tower-unscreen.gif";
import customerIcon from "../../../public/images/customers.png"; // Import customer icon
import splitterIcon from "../../../public/images/splitter.png"; // Import customer icon
import fdtIcon from "../../../public/images/optical-fiber.png"; // Import customer icon

/**
 * KarachiMapWidgets
 * Merged into a single, modern, floating toolbox with tabbed navigation.
 * Uses React state/refs to manage control logic injected into the Google Map DOM.
 */

// === CONSTANTS FOR CUSTOM BASEMAP ===
const DARK_MAP_ID = 'custom_dark_mode';

const DARK_MAP_STYLES = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
];
// ==============================

// 🛑 NEW: Helper function to build clean InfoWindow HTML
// This function generates the content with fields well-defined for each feature type.
const generateFeatureHtml = (feature, fieldName, layerName, position) => {
    const title = `${layerName}: ${feature[fieldName] || "N/A"}`;
    
    let rows = []; // Array of [label, value] pairs

    // Add fields based on layer type
    switch (layerName) {
        case "Fibers":
            if (feature.Core_No) rows.push(["Core No", feature.Core_No]);
            if (feature.Connectivity_Type) rows.push(["Connectivity", feature.Connectivity_Type]);
            if (feature.Calculated_Length) rows.push(["Calculated_Length (m)", feature.Calculated_Length]);
            
            break;
        case "Handholes":
            if (feature.Ring_Name) rows.push(["Ring", feature.Ring_Name]);
            if (feature.Condition) rows.push(["Condition", feature.Condition]);
            break;
        case "Joints":
            if (feature.Joint_Type) rows.push(["Joint Type", feature.Joint_Type]);
            if (feature.Connectivity_Type) rows.push(["Connectivity", feature.Connectivity_Type]);
            if (feature.Ring_Name) rows.push(["Ring", feature.Ring_Name]);
            break;
        case "Nodes":
            if (feature.Ring_Name) rows.push(["Ring", feature.Ring_Name]);
            if (feature.Region) rows.push(["Region", feature.Region]);
            break;
        case "Customers":
            if (feature.Customer_ID) rows.push(["Name", feature.Customer_ID]);
            if (feature.Customer_Name) rows.push(["Name", feature.Customer_Name]);
            if (feature.Node_Name) rows.push(["Node", feature.Node_Name]);
            if (feature.Status) rows.push(["Status", feature.Status]);
            break;
               case "Fat":
             if (feature.FAT_ID) rows.push(["Name", feature.FAT_ID]);
            if (feature.Name) rows.push(["Name", feature.Name]);
            if (feature.FDT_PON_Splitter_ID) rows.push(["Node", feature.FDT_PON_Splitter_ID]);
            if (feature.Placement) rows.push(["Status", feature.Placement]);
            break;
             case "Fdt":
             if (feature.FDT_PON_Splitter_ID) rows.push(["Name", feature.FDT_PON_Splitter_ID]);
            if (feature.Name) rows.push(["Name", feature.Name]);
            if (feature.Capacity) rows.push(["Node", feature.Capacity]);
            if (feature.Placement) rows.push(["Status", feature.Placement]);
            break;
    }

    // Add Lat/Lng for all point features
    if (layerName !== "Fibers" && position) {
        rows.push(["Lat", position.lat.toFixed(6)]);
        rows.push(["Lng", position.lng.toFixed(6)]);
    }

    // Generate table HTML from rows
    const tableHtml = rows
        .map(([label, value]) => `<tr><td style="color:white;font-weight:bold;padding-right:10px;">${label}</td><td>${value}</td></tr>`)
        .join("");

    const imageHtml = feature.Image_URL ? `<img src="${feature.Image_URL}" style="width:100%;max-height:100px;object-fit:cover;border-radius:6px;margin-top:10px;cursor:pointer;" onclick="window.open('${feature.Image_URL}','_blank')" />` : "";

    return `
        <div style="font-family:Arial;color:white;background:#0F2A4D;padding:12px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.45);min-width:220px">
            <h4 style="margin:0 0 10px 0;color:#9fe0ff;font-size:16px;">${title}</h4>
            <table style="color:white;font-size:13px;width:100%;">
                ${tableHtml}
            </table>
            ${imageHtml}
        </div>
    `;
};


export default function RawalpindiMapWidgets({
  map,
  handholes = [],
  joints = [],
  nodes = [],
  fibers = [],
  fiberAttachments = [], 
  customers = [], // ⬅️ NEW
  fat = [], // ⬅️ NEW
  fdt = [], // ⬅️ NEW
  showHandholes,
  setShowHandholes,
  showJoints,
  setShowJoints,
  showNodes,
  setShowNodes,
  showFibers,
  setShowFibers,
  showFiberAttachments,             // ✅ NEW
  setShowFiberAttachments, 
  showCustomers, // ⬅️ NEW
  setShowCustomers, // ⬅️ NEW
  showFat,
  setShowFat,
  showFdt,
  setShowFdt
}) {
  // === REFS & STATE ===
  const dataRef = useRef({ handholes, joints, nodes, fiberAttachments, fibers, customers, fat,fdt }); // ⬅️ NEW: Added customers
  const controlContainerRef = useRef(null);
  const createdListenersRef = useRef([]);
  const tempMarkerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const timeoutRef = useRef(null);

  const searchTermRef = useRef("");
  const searchLayerRef = useRef("handholes");

  // UI controlled state (local)
  const [widgetOpen, setWidgetOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState("search"); 
  const [searchLayer, setSearchLayer] = useState("handholes");
  const [searchTerm, setSearchTerm] = useState("");

  const searchBoxAddedRef = useRef(false);

  // === DATA & STATE SYNC EFFECTS ===
  // 1. Keep dataRef current with the latest data props
  useEffect(() => {
    dataRef.current = { handholes, joints, nodes, fiberAttachments, fibers,  customers, fat,fdt  }; // ⬅️ NEW: Added customers
  }, [handholes, joints, nodes, fiberAttachments, fibers, customers, fat, fdt]); // ⬅️ NEW: Added customers

  // 2. Sync local state changes to refs immediately
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    searchLayerRef.current = searchLayer;
  }, [searchLayer]);

  // Helper to create DOM nodes
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "className") node.className = v;
      else if (k === "innerHTML") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c instanceof Node) node.appendChild(c);
    });
    return node;
  };

  // --- Cleanup function definitions ---
  const cleanupOverlays = () => {
    if (tempMarkerRef.current) {
      try { tempMarkerRef.current.setMap(null); } catch {}
      tempMarkerRef.current = null;
    }
    if (infoWindowRef.current) {
      try { infoWindowRef.current.close(); } catch {}
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // --- Search function (now reads from refs) ---
  const doFeatureSearch = () => {
    const term = (searchTermRef.current || "").trim(); 
    const currentSearchLayer = searchLayerRef.current; 
    
    if (!term) { alert("Enter a search term"); return; }
    
    const currentData = dataRef.current;
    let list = [], field = "", layerName = "";
    
    switch (currentSearchLayer) { 
        case "handholes": list = currentData.handholes; field = "HH_ID"; layerName = "Handholes"; break;
        case "joints": list = currentData.joints; field = "Joint_ID"; layerName = "Joints"; break;
        case "nodes": list = currentData.nodes; field = "OLT_Name"; layerName = "Nodes"; break;
        case "fiber Attachments": list = currentData.fiberAttachments; field = "FA_ID"; layerName = "Fiber Attachments"; break;
        case "fibers": list = currentData.fibers; field = "FOC_ID"; layerName = "Fibers"; break;
        case "customers": list = currentData.customers; field = "Customer_ID"; layerName = "Customers"; break; // ⬅️ NEW
        case "fat": list = currentData.fat; field = "FAT_ID"; layerName = "Fat"; break; // ⬅️ NEW
        case "fdt": list = currentData.fdt; field = "FDT_PON_Splitter_ID"; layerName = "Fdt"; break; // ⬅️ NEW
        default: return;
    }

    const found = list.find(it => {
      if (!it) return false;
      const v = it[field];
      if (v == null) return false;
      return v.toString().toLowerCase() === term.toLowerCase(); 
    });

    if (!found) { alert("No matching record found."); return; }

    cleanupOverlays(); 

    let position = null;
    if (currentSearchLayer === "fibers") {
      if (found.path && found.path.length > 0) {
        position = { lat: found.path[0].lat, lng: found.path[0].lng };
      } else if (found.SHAPE && found.SHAPE.points && found.SHAPE.points.length > 0) {
        position = { lat: parseFloat(found.SHAPE.points[0].y), lng: parseFloat(found.SHAPE.points[0].x) };
      }
    } else {
      const lat = parseFloat(found.Latitude);
      const lng = parseFloat(found.Longitude);
      if (!isNaN(lat) && !isNaN(lng)) position = { lat, lng };
    }

    if (!position) { alert("Location not available for this record."); return; }

    map.panTo(position);
    map.setZoom(17);

    tempMarkerRef.current = new window.google.maps.Marker({
      position,
      map,
      title: `${field}: ${found[field]}`,
      animation: window.google.maps.Animation.DROP,
      icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#FFD54F',
          fillOpacity: 1,
          strokeColor: '#000',
          strokeWeight: 2,
          scale: 8,
      }
    });

    // 🛑 UPDATED: Use the new helper function to generate clean HTML
    const content = generateFeatureHtml(found, field, layerName, position);
    
    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(map, tempMarkerRef.current);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try { if (tempMarkerRef.current) tempMarkerRef.current.setMap(null); } catch {}
      tempMarkerRef.current = null;
      timeoutRef.current = null;
    }, 15000);
  };

  // === MAIN MAP CONTROL INJECTION EFFECT (Runs once on mount) ===
  useEffect(() => {
    if (!map || !window.google || !window.google.maps) return;


//google search start
 // ✅ Prevent duplicate setup
    if (searchBoxAddedRef.current) return;
    searchBoxAddedRef.current = true;

    /** ✅ Create search input element */
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search Google Maps";

 input.style.cssText = `
  box-sizing: border-box;
  border: 1px solid #0F2A4D;
  width: 300px;
  height: 38px;
  margin-top: 12px;
  padding: 0 12px;
  border-radius: 10px;
  background: white;                                                        
  color: black;
  font-size: 15px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
  outline: none;
`;


    /** ✅ Add to map control (top-center) */
    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);

    /** ✅ Bind Places SearchBox */
    const searchBox = new window.google.maps.places.SearchBox(input);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || !places.length) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      map.panTo(place.geometry.location);
      map.setZoom(15);

      new window.google.maps.Marker({
        map,
        position: place.geometry.location
      });
    });

//google search ends


    // --- Cleanup function definitions ---
    const cleanupListeners = () => {
      createdListenersRef.current.forEach((fn) => {
        try { fn(); } catch {}
      });
      createdListenersRef.current = [];
    };

    if (!infoWindowRef.current) infoWindowRef.current = new window.google.maps.InfoWindow();

    
    // BASMAP FIX: Register the custom map style once
    if (map.mapTypes.get(DARK_MAP_ID) === undefined) {
        const darkMapType = new window.google.maps.StyledMapType(
            DARK_MAP_STYLES,
            { name: "Dark Mode" }
        );
        map.mapTypes.set(DARK_MAP_ID, darkMapType);
    }


    // 1. Create the master container for the widget
    const container = el("div", {
      style: "display:flex;flex-direction:column;margin:10px;font-family:Arial;z-index:9999;pointer-events:auto;",
    });

    // 2. The Floating Toggle Button
    const toggleButton = el(
      "button",
      {
        className: "widget-toggle-btn",
        style:
          "background:#0B1F4B;color:white;width:40px;height:40px;border-radius:50%;border:none;box-shadow: 0 4px 8px rgba(0,0,0,0.4);cursor:pointer;font-size:20px;font-weight:bold;align-self:flex-start;margin-bottom:10px;transition: background-color 0.2s;",
        innerHTML: widgetOpen ? "✖" : "☰",
      }
    );
    toggleButton.onclick = () => setWidgetOpen(p => !p);

    // 3. The Main Toolbox Panel
    const toolboxPanel = el("div", {
      className: "main-toolbox-panel",
      style:
        `width:300px;max-width:90vw;background:#07162a;color:white;padding:10px;border-radius:10px;box-shadow: 0 6px 18px rgba(3,10,23,0.6);display:${widgetOpen ? 'flex' : 'none'};flex-direction:column;gap:10px;`,
    });
                                                                        
    // --- A. Tab Navigation ---
    const tabsData = [
      { key: "search", icon: "🔎" },
      { key: "layers", icon: "🧩" },
      { key: "basemap", icon: "🗺" },
      { key: "measure", icon: "📏" },
    ];

    const tabNav = el("div", { className: "tab-nav", style: "display:flex;justify-content:space-around;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);" });

    tabsData.forEach(tab => {
        const tabBtn = el("button", {
            style: `padding:8px 12px;border:none;border-radius:6px;cursor:pointer;font-size:18px;background:${activeTab === tab.key ? '#0B1F4B' : 'transparent'};color:white;transition: background-color 0.2s;`,
            innerHTML: tab.icon,
            title: tab.key.charAt(0).toUpperCase() + tab.key.slice(1)
        });
        tabBtn.onclick = () => setActiveTab(tab.key);
        tabNav.appendChild(tabBtn);
    });
    toolboxPanel.appendChild(tabNav);

    // --- B. Tab Content ---
    const tabContent = el("div", { style: "min-height:200px; padding: 5px 0;" });
    toolboxPanel.appendChild(tabContent);

    // --- B1. Search Tab Content ---
    const searchDiv = el("div", { className: "tab-content search-tab", style: "display:none;flex-direction:column;gap:10px;" });
    
    // Feature Search
    const featureSearchTitle = el("h4", { style: "margin:0;color:#9fe0ff;font-size:16px;" }, ["Feature Search"]);
    const searchLayerSelect = el("select", { className: "search-layer-select", style: "width:100%;padding:8px;border-radius:6px;background:#0F2A4D;color:white;border:none;" });
    // ⬅️ UPDATED: Added customers
    ["handholes", "joints", "nodes", "fiberAttachments", "fibers", "customers", "fat", "fdt"].forEach((val) => {
        const opt = el("option", { value: val }, [val.charAt(0).toUpperCase() + val.slice(1)]);
        searchLayerSelect.appendChild(opt);
    });
    const searchInput = el("input", { placeholder: "Enter ID / Name", className: "search-input", style: "width:100%;padding:8px;border-radius:6px;border:none;background:#0F2A4D;color:white;" });
    const searchBtn = el("button", { className: "feature-search-btn", style: "width:100%;padding:8px;border-radius:6px;border:none;background:#08a045;color:white;cursor:pointer;" }, ["Search Feature"]);
    
    // Place Search
    const placeSearchTitle = el("h4", { style: "margin:10px 0 0 0;color:#9fe0ff;font-size:16px;" }, ["Place Search (Google)"]);
    const placeInput = el("input", { placeholder: "Search place...", className: "place-search-input", style: "width:100%;padding:8px;border-radius:6px;border:none;background:#0F2A4D;color:white;" });

    searchDiv.appendChild(featureSearchTitle);
    searchDiv.appendChild(searchLayerSelect);
    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(searchBtn);
    searchDiv.appendChild(el("div", { style: "height:1px;background:rgba(255,255,255,0.1);margin:10px 0;" }));
    searchDiv.appendChild(placeSearchTitle);
    searchDiv.appendChild(placeInput);
    tabContent.appendChild(searchDiv);

    // Hookup local variables for search
    searchLayerSelect.onchange = (e) => setSearchLayer(e.target.value);
    searchInput.oninput = (e) => setSearchTerm(e.target.value);
    searchBtn.onclick = doFeatureSearch;

    // Places Autocomplete initialization
    let autocomplete = null;
    let acListener = null;
    try {
      if (window.google.maps.places) {
        autocomplete = new window.google.maps.places.Autocomplete(placeInput, { fields: ["geometry", "name"] });
        acListener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) { alert("Place has no location."); return; }
          cleanupOverlays(); 
          map.panTo(place.geometry.location);
          map.setZoom(14);
          
          tempMarkerRef.current = new window.google.maps.Marker({ position: place.geometry.location, map, title: place.name || "Place" });
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`<div style="padding:8px;background:#0F2A4D;color:white;border-radius:6px;">${place.name}</div>`);
            infoWindowRef.current.open(map, tempMarkerRef.current);
          }
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => { try { if (tempMarkerRef.current) tempMarkerRef.current.setMap(null); } catch {} tempMarkerRef.current = null; timeoutRef.current = null; }, 10000);
        });
        createdListenersRef.current.push(() => { try { window.google.maps.event.removeListener(acListener); } catch {} });
      }
    } catch (e) {
      console.warn("Google Maps Places library not available for Autocomplete.", e);
    }
    
    // --- B2. Layers Tab Content (Checkboxes) ---
    const layersDiv = el("div", { className: "tab-content layers-tab", style: "display:none;flex-direction:column;gap:10px;" });
    const row = (iconSrc, label, checked, onChange) => {
      const labelEl = el("label", { className: "layer-row", style: "display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:8px;" });
      const input = el("input", { type: "checkbox" });
      if (checked) input.checked = true;
      input.onclick = (ev) => { ev.stopPropagation(); onChange(); };
      const img = el("img", { src: iconSrc, width: 18, height: 18, style: "display:inline-block;" });
      const span = el("span", { style: "color:#fff;" }, [label]);
      labelEl.appendChild(input);
      labelEl.appendChild(img);
      labelEl.appendChild(span);
      return labelEl;
    };
    layersDiv.appendChild(row(nodeIcon, "Nodes", showNodes, () => setShowNodes((p) => !p)));
    layersDiv.appendChild(row(handholeIcon, "Handholes", showHandholes, () => setShowHandholes((p) => !p)));
    layersDiv.appendChild(row(jointsIcon, "Joints", showJoints, () => setShowJoints((p) => !p)));
    layersDiv.appendChild(row(customerIcon, "Customers", showCustomers, () => setShowCustomers((p) => !p))); // ⬅️ NEW
    layersDiv.appendChild(row(splitterIcon, "Fat", showFat, () => setShowFat((p) => !p))); // ⬅️ NEW
    layersDiv.appendChild(row(fdtIcon, "Fdt", showFdt, () => setShowFdt((p) => !p))); // ⬅️ NEW
    

// --- Fiber Attachment Toggle ---
const fiberAttachRow = el("div", { style: "margin-top:6px;" });

const fiberAttachInner = el("div", {
  style: "display:flex;align-items:center;gap:8px;cursor:pointer"
});

const fiberAttachCheckbox = el("input", {
  type: "checkbox",
  className: "fiber-attachment-checkbox"
});

if (showFiberAttachments) fiberAttachCheckbox.checked = true;

fiberAttachCheckbox.onclick = (e) => {
  e.stopPropagation();
  setShowFiberAttachments(p => !p);
};

fiberAttachInner.appendChild(fiberAttachCheckbox);
fiberAttachInner.appendChild(
  el("span", { style: "color:#fff;" }, ["Fiber Attachments"])
);

fiberAttachRow.appendChild(fiberAttachInner);
layersDiv.appendChild(fiberAttachRow);


    // Fiber Legend
    const fiberRow = el("div", { style: "margin-top:6px;" });
    const fiberRowInner = el("div", { style: "display:flex;justify-content:space-between;align-items:center;cursor:pointer" });
    const fiberLeft = el("div", { style: "display:flex;align-items:center;gap:8px" });
    const fiberCheckbox = el("input", { type: "checkbox", className: "fiber-checkbox" });
    if (showFibers) fiberCheckbox.checked = true;
    fiberCheckbox.onclick = (e) => { e.stopPropagation(); setShowFibers((p) => !p); };
    fiberLeft.appendChild(fiberCheckbox);
    fiberLeft.appendChild(el("span", { style: "color:#fff;" }, ["Core Network"]));
    const fiberToggle = el("span", { style: "color:#fff;cursor:pointer" }, ["▾"]);
    fiberRowInner.appendChild(fiberLeft);
    fiberRowInner.appendChild(fiberToggle);
    fiberRow.appendChild(fiberRowInner);
    const fiberLegend = el("div", { className: "fiber-legend", style: "margin-left:22px;margin-top:8px;display:none" });
    fiberLegend.appendChild(el("div", { style: "display:flex;align-items:center;gap:8px;margin-bottom:6px" }, [
      el("div", { style: "width:26px;height:4px;background:#0000FF;border-radius:2px" }),
      el("span", { style: "color:#fff;font-size:12px" }, ["Aerial (Blue)"])
    ]));
    fiberLegend.appendChild(el("div", { style: "display:flex;align-items:center;gap:8px" }, [
      el("div", { style: "width:26px;height:4px;background:#00FF99;border-radius:2px" }),
      el("span", { style: "color:#fff;font-size:12px" }, ["Buried (Green)"])
    ]));
    fiberRowInner.onclick = (e) => {
      if (e.target && e.target.tagName === "INPUT") return;
      fiberLegend.style.display = fiberLegend.style.display === "block" ? "none" : "block";
      fiberToggle.innerText = fiberLegend.style.display === "block" ? "▴" : "▾";
    };
    layersDiv.appendChild(fiberRow);
    layersDiv.appendChild(fiberLegend);
    tabContent.appendChild(layersDiv);


    // --- B3. Basemap Tab Content ---
    const basemapDiv = el("div", { className: "tab-content basemap-tab", style: "display:none;flex-direction:column;gap:10px;" });
    const basemapButtons = [
      { name: "Roadmap", id: "roadmap" }, { name: "Satellite", id: "satellite" },
      { name: "Hybrid", id: "hybrid" }, { name: "Terrain", id: "terrain" },    
      { name: "Dark Mode", id: DARK_MAP_ID }, 
    ];
    basemapButtons.forEach((b) => {
      const btn = el("button", { style: "width:100%;padding:8px;border-radius:6px;border:none;background:#0F2A4D;color:white;cursor:pointer;" }, [b.name]);
      btn.onclick = () => map.setMapTypeId(b.id);
      basemapDiv.appendChild(btn);
    });
    tabContent.appendChild(basemapDiv);

    // --- B4. Measure Tab Content ---
    const measureDiv = el("div", { className: "tab-content measure-tab", style: "display:none;flex-direction:column;gap:10px;" });
    const startBtn = el("button", { className: "measure-start-btn", style: "width:100%;padding:8px;border-radius:6px;border:none;background:#08a045;color:white;cursor:pointer;" }, ["Start Measuring"]);
    const removeBtn = el("button", { className: "measure-remove-btn", style: "width:100%;padding:8px;border-radius:6px;border:none;background:#b91c1c;color:white;cursor:pointer;" }, ["Remove Selection"]);
    const measureInfo = el("div", { className: "measure-info", style: "color:#FFD54F;min-height:18px;font-weight:600;text-align:center;" }, [""]);
    measureDiv.appendChild(startBtn);
    measureDiv.appendChild(removeBtn);
    measureDiv.appendChild(measureInfo);

    // measure internals
    let measuring = false;
    let measureClickListener = null;
    let measurePoints = [];
    
    const resetMeasureState = () => {
        measuring = false;
        startBtn.innerText = "Start Measuring";
        startBtn.style.backgroundColor = "#08a045"; // Reset button color
        if (measureClickListener) {
          try { window.google.maps.event.removeListener(measureClickListener); } catch {}
          measureClickListener = null;
        }
    };

    startBtn.onclick = () => {
      if (!window.google.maps.geometry || !window.google.maps.geometry.spherical) {
         alert("Distance measure requires Google Maps 'geometry' library. Add &libraries=geometry to maps script URL.");
        return;
      }
      if (!measuring) {
        resetMeasureState();
        measuring = true;
        startBtn.innerText = "Click to select points (2)";
        startBtn.style.backgroundColor = "#ff7f00"; // Orange when active
        measurePoints = [];
        cleanupOverlays(); 

        measureClickListener = map.addListener("click", (e) => {
          measurePoints.push(e.latLng);
          if (measurePoints.length === 2) {
            const line = new window.google.maps.Polyline({ path: measurePoints, map, strokeColor: "#FFD54F", strokeWeight: 4 });
            tempMarkerRef.current = line; 
            const dist = window.google.maps.geometry.spherical.computeDistanceBetween(measurePoints[0], measurePoints[1]);
            const mid = new window.google.maps.LatLng((measurePoints[0].lat() + measurePoints[1].lat())/2, (measurePoints[0].lng() + measurePoints[1].lng())/2);
            const display = dist > 1000 ? (dist/1000).toFixed(2) + " km" : dist.toFixed(1) + " m";
            measureInfo.innerText = display;

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`<div style="background:white;color:#0F2A4D;padding:8px;border-radius:8px;font-weight:600;">Distance: ${display}</div>`);
               infoWindowRef.current.setPosition(mid);
              infoWindowRef.current.open(map);
            }
            resetMeasureState();
            measurePoints = [];
          } else if (measurePoints.length === 1) {
          startBtn.innerText = "Click to select 2nd point";
            // Add a temporary marker for the first point
            tempMarkerRef.current = new window.google.maps.Marker({
                position: measurePoints[0],
                map,
                icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: "#FFD54F", fillOpacity: 1, strokeWeight: 0 }
            });
          }
        });
        createdListenersRef.current.push(() => { try { window.google.maps.event.removeListener(measureClickListener); } catch {} });
      } else {
        resetMeasureState();
      }
    };

    removeBtn.onclick = () => { cleanupOverlays(); resetMeasureState(); measureInfo.innerText = ""; };
    tabContent.appendChild(measureDiv);


    // 4. Assemble and Push to Map
    container.appendChild(toggleButton);
    container.appendChild(toolboxPanel);

    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(container);
    controlContainerRef.current = container;

    // --- Cleanup function for unmount ---
    return () => {
      try {
        const ctrlArr = map.controls[window.google.maps.ControlPosition.TOP_LEFT].getArray();
        const idx = ctrlArr.indexOf(container);
        if (idx > -1) map.controls[window.google.maps.ControlPosition.TOP_LEFT].removeAt(idx);
      } catch (e) {}
      cleanupListeners();
      cleanupOverlays();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]); 

  // === UI SYNC EFFECT (Toggles panel visibility and handles tabs) ===
  useEffect(() => {
    const container = controlContainerRef.current;
    if (!container) return;

    const toggleButton = container.querySelector(".widget-toggle-btn");
    const toolboxPanel = container.querySelector(".main-toolbox-panel");
    const contentTabs = container.querySelectorAll(".tab-content");
    const navTabs = container.querySelectorAll(".tab-nav button");

    // 1. Toggle Button/Panel visibility
    if (toggleButton) toggleButton.innerHTML = widgetOpen ? "✖" : "☰";
    if (toolboxPanel) toolboxPanel.style.display = widgetOpen ? 'flex' : 'none';

    // 2. Tab Content switching
    contentTabs.forEach(div => {
        div.style.display = div.classList.contains(`${activeTab}-tab`) ? 'flex' : 'none';
    });
    
    // 3. Tab Nav button styling
    navTabs.forEach(btn => {
        const key = btn.title.toLowerCase();
        btn.style.backgroundColor = activeTab === key ? '#0B1F4B' : 'transparent';
    });

  }, [widgetOpen, activeTab]);

  // === CHECKBOX SYNC EFFECT (Keeps layer checkboxes in sync with external props) ===
  useEffect(() => {
    const container = controlContainerRef.current;
    if (!container) return;
    const inputs = container.querySelectorAll(".layers-tab input[type='checkbox']");

    inputs.forEach((input) => {
      const parent = input.closest("label") || input.parentElement;
      if (!parent) return;
      
      const labelSpan = parent.querySelector("span");
      if (!labelSpan) return;
      const labelText = labelSpan.innerText || "";

      if (labelText.includes("Handholes") && input.checked !== !!showHandholes) input.checked = !!showHandholes;
      if (labelText.includes("Joints") && input.checked !== !!showJoints) input.checked = !!showJoints;
      if (labelText.includes("Nodes") && input.checked !== !!showNodes) input.checked = !!showNodes;
      if (labelText.includes("Customers") && input.checked !== !!showCustomers) input.checked = !!showCustomers;
      if (labelText.includes("Fat") && input.checked !== !!showFat) input.checked = !!showFat;
      if (labelText.includes("Fdt") && input.checked !== !!showFdt) input.checked = !!showFdt;
       if (labelText.includes("Fiber Attachments") && input.checked !== !!showFiberAttachments) {input.checked = !!showFiberAttachments;}

      if (labelText.includes("Core Network") && input.checked !== !!showFibers) input.checked = !!showFibers;

    });
  }, [showHandholes, showJoints, showNodes, showFiberAttachments, showFibers ]);

  return null; 
}                                                     



