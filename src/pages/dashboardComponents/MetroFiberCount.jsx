// src/components/FiberLengthCard.jsx

import React, { useState, useEffect } from 'react';

// ⬅️ Use environment variable for the base URL
const API_BASE_URL = import.meta.env.VITE_GIS_API_BASE_URL;

const METRO_FIBER_API_URL = `${API_BASE_URL}/n_metroFiber`;
const FIBER_ATTACHMENT_API_URL = `${API_BASE_URL}/n_fa`;

const METERS_TO_KM = 0.001;

export default function FiberLengthCard() {
  const [totalLengthKm, setTotalLengthKm] = useState(0);
  const [metroKm, setMetroKm] = useState(0);
  const [attachmentKm, setAttachmentKm] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchFiberLength = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [metroRes, attachmentRes] = await Promise.all([
          fetch(METRO_FIBER_API_URL),
          fetch(FIBER_ATTACHMENT_API_URL),
        ]);

        if (!metroRes.ok || !attachmentRes.ok) {
          throw new Error('API request failed');
        }

        const metroData = await metroRes.json();
        const attachmentData = await attachmentRes.json();

        const sumCalculatedLength = (data) =>
          Array.isArray(data)
            ? data.reduce((sum, item) => {
                const val = parseFloat(item.Calculated_Length);
                return sum + (isNaN(val) ? 0 : val);
              }, 0)
            : 0;

        const metroMeters = sumCalculatedLength(metroData);
        const attachmentMeters = sumCalculatedLength(attachmentData);

        const metroKmVal = metroMeters * METERS_TO_KM;
        const attachmentKmVal = attachmentMeters * METERS_TO_KM;

        setMetroKm(metroKmVal);
        setAttachmentKm(attachmentKmVal);
        setTotalLengthKm(metroKmVal + attachmentKmVal);

      } catch (e) {
        console.error(e);
        setError("Failed to load fiber length");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiberLength();
  }, []);

  // ---------------- STYLES (unchanged + tooltip) ----------------

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

  const titleStyle = {
    color: "#00c2ff",
    fontSize: "16px",
    fontWeight: 600,
  };
    const dividerStyle = {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Light gray/white with transparency
    margin: '10px 0', // Vertical spacing for separation
  };


  const countStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#00e5ff",
    cursor: "pointer",
  };

  const unitStyle = {
    fontSize: "14px",
    color: "white",
    marginLeft: "5px",
  };

  const tooltipStyle = {
    position: "absolute",
    bottom: "120%",
    backgroundColor: "#0b2545",
    border: "1px solid #1b3a63",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "13px",
    minWidth: "180px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
    zIndex: 10,
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: 8 }}>
        <div style={titleStyle}>Total Core Network</div>
      </div>
<div style={dividerStyle} />
      {isLoading && <div style={countStyle}>...</div>}
      {error && <div style={{ color: "#ff4d4d" }}>{error}</div>}

      {!isLoading && !error && (
        <div
          style={{ position: "relative", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* VALUE */}
          <div style={countStyle}>
            {totalLengthKm.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div style={unitStyle}>KM</div>

          {/* TOOLTIP */}
          {showTooltip && (
            <div style={tooltipStyle}>
              <div style={rowStyle}>
                <span>Fiber</span>
                <strong>{metroKm.toFixed(2)} KM</strong>
              </div>
              <div style={rowStyle}>
                <span>FA</span>
                <strong>{attachmentKm.toFixed(2)} KM</strong>
              </div>
              <hr style={{ borderColor: "#1b3a63", margin: "6px 0" }} />
              <div style={rowStyle}>
                <span>Total</span>
                <strong>{totalLengthKm.toFixed(2)} KM</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
