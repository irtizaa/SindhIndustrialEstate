// src/components/maps/LayerListPanel.jsx
export default function LayerListPanel({
  showHandholes, setShowHandholes,
  showJoints, setShowJoints,
  showCustomers, setShowCustomers,
  showPoles, setShowPoles,
  showNodes, setShowNodes,
  showFat, setShowFat,
  showFdt, setShowFdt,
  showFibers, setShowFibers,
  showFiberAttachments, setShowFiberAttachments,
}) {
  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "150px",
        right: 35,   
        background: "#020328ff",
        padding: "14px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 9999,
        width: "220px",
        
      }}
    >
      <h3 style={{ margin: "0 0 10px", fontSize: "15px" }}>Layers</h3>

      <label style={itemStyle}>
        <input type="checkbox" checked={showHandholes} onChange={e => setShowHandholes(e.target.checked)} />
        Handholes
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showJoints} onChange={e => setShowJoints(e.target.checked)} />
        Joints
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showCustomers} onChange={e => setShowCustomers(e.target.checked)} />
        Customers
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showPoles} onChange={e => setShowPoles(e.target.checked)} />
        Poles
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showNodes} onChange={e => setShowNodes(e.target.checked)} />
        Nodes
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showFat} onChange={e => setShowFat(e.target.checked)} />
        FAT
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showFdt} onChange={e => setShowFdt(e.target.checked)} />
        FDT
      </label>

     <label style={itemStyle}>
  <input
    type="checkbox"
    checked={showFibers}
    onChange={e => {
      setShowFibers(e.target.checked);
      if (map && e.target.checked) {
        // Add Core Fibers layer
        if (!map.getSource("core-fibers")) {
          map.addSource("core-fibers", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: fibersData.map(f => ({
                type: "Feature",
                geometry: f.geometry,
                properties: { Connectivity_Type: f.Connectivity_Type },
              })),
            },
          });

          map.addLayer({
            id: "core-fibers",
            type: "line",
            source: "core-fibers",
            paint: {
              "line-color": ["case",
                ["==", ["get", "Connectivity_Type"], "Aerial"], "#007bff",
                ["==", ["get", "Connectivity_Type"], "Buried"], "#28a745",
                "#000000"
              ],
              "line-width": 2,
              "line-dasharray": [1, 0], // straight line
            },
          });
        } else {
          map.setLayoutProperty("core-fibers", "visibility", "visible");
        }
      } else if (map && map.getLayer("core-fibers")) {
        map.setLayoutProperty("core-fibers", "visibility", "none");
      }
    }}
  />
  Core Fibers
</label>

<label style={itemStyle}>
  <input
    type="checkbox"
    checked={showFiberAttachments}
    onChange={e => {
      setShowFiberAttachments(e.target.checked);
      if (map && e.target.checked) {
        // Add Fiber Attachments layer
        if (!map.getSource("fiber-attachments")) {
          map.addSource("fiber-attachments", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: fiberAttachmentsData.map(fa => ({
                type: "Feature",
                geometry: fa.geometry,
                properties: { Connectivity_Type: fa.Connectivity_Type },
              })),
            },
          });

          map.addLayer({
            id: "fiber-attachments",
            type: "line",
            source: "fiber-attachments",
            paint: {
              "line-color": ["case",
                ["==", ["get", "Connectivity_Type"], "Aerial"], "#007bff",
                ["==", ["get", "Connectivity_Type"], "Buried"], "#28a745",
                "#000000"
              ],
              "line-width": 2,
              "line-dasharray": [4, 2], // dotted line
            },
          });
        } else {
          map.setLayoutProperty("fiber-attachments", "visibility", "visible");
        }
      } else if (map && map.getLayer("fiber-attachments")) {
        map.setLayoutProperty("fiber-attachments", "visibility", "none");
      }
    }}
  />
  Fiber Attachments
</label>

    </div>
  );
}
