import { useState } from "react";

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
  const [showFiberLegend, setShowFiberLegend] = useState(false);
  const [showFiberAttachLegend, setShowFiberAttachLegend] = useState(false);

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "14px",
    cursor: "pointer",
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
        color: "#fff",
      }}
    >
      <h3 style={{ margin: "0 0 10px", fontSize: "15px" }}>Layers</h3>

       <label style={itemStyle}>
        <input type="checkbox" checked={showNodes} onChange={e => setShowNodes(e.target.checked)} />
        OLT
      </label>
      
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
        <input type="checkbox" checked={showFat} onChange={e => setShowFat(e.target.checked)} />
        FAT
      </label>

      <label style={itemStyle}>
        <input type="checkbox" checked={showFdt} onChange={e => setShowFdt(e.target.checked)} />
        FDT
      </label>

       {/* ================= Fiber Attachments ================= */}
        <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setShowFiberAttachLegend(p => !p)}
        >
          <label style={{ ...itemStyle, marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={showFiberAttachments}
              onChange={e => setShowFiberAttachments(e.target.checked)}
              onClick={e => e.stopPropagation()}
            />
            Fiber Attachment
          </label>

          <span style={{ fontSize: "12px" }}>
            {showFiberAttachLegend ? "▴" : "▾"}
          </span>
        </div>

        {showFiberAttachLegend && (
          <div style={{ marginLeft: "22px", marginTop: "8px" }}>
           

            {/* Attachment – Aerial */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "26px", borderTop: "4px dotted #007bff" }} />
              <span style={{ fontSize: "12px" }}> Aerial</span>
            </div>

            {/* Attachment – Buried */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "26px", borderTop: "4px dotted #28a745" }} />
              <span style={{ fontSize: "12px" }}> Buried</span>
            </div>
          </div>
        )}
      </div>

      {/* ================= Core Fibers + Legend ================= */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setShowFiberLegend(p => !p)}
        >
          <label style={{ ...itemStyle, marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={showFibers}
              onChange={e => setShowFibers(e.target.checked)}
              onClick={e => e.stopPropagation()}
            />
            Core Fibers
          </label>

          <span style={{ fontSize: "12px" }}>
            {showFiberLegend ? "▴" : "▾"}
          </span>
        </div>

        {showFiberLegend && (
          <div style={{ marginLeft: "22px", marginTop: "8px" }}>
            {/* Fiber – Aerial */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "26px", height: "4px", background: "#007bff", borderRadius: "2px" }} />
              <span style={{ fontSize: "12px" }}> Aerial</span>
            </div>

            {/* Fiber – Buried */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "26px", height: "4px", background: "#28a745", borderRadius: "2px" }} />
              <span style={{ fontSize: "12px" }}> Buried</span>
            </div>

           
          </div>
        )}
      </div>

     
    </div>                                      
  );
}
