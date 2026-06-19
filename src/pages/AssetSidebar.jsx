import React, { useState, useRef, useEffect } from 'react';
// Assuming you have other necessary imports like Google Maps scripts loaded previously
// import { loadGoogleMapsScript } from './utils';

// --- NEW COMPONENT: Custom Sidebar/Info Panel ---
const AssetSidebar = ({ asset, onClose, onImageClick }) => {
    if (!asset) return null;

    const imageUrl = asset.Image_URL || "https://placehold.co/280x160/34A853/FFFFFF?text=No+Image+Available";

    // This styling mimics a mobile bottom sheet or a side panel
    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                maxWidth: '400px', // Typical sidebar width on desktop
                backgroundColor: 'white',
                zIndex: 9999,
                boxShadow: '4px 0 15px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease-out',
                transform: asset ? 'translateX(0)' : 'translateX(-100%)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                {/* 1. Header Image (Full Width) */}
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                        src={imageUrl}
                        alt="Asset Image" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/280x200/34A853/FFFFFF?text=Image+Load+Failed'; }}
                        onClick={() => onImageClick(imageUrl)}
                    />
                    {/* Close Button at the top of the panel */}
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            fontSize: '18px',
                            cursor: 'pointer',
                        }}
                    >&times;</button>
                </div>

                {/* 2. Main Content Area */}
                <div style={{ padding: '16px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1f1f1f', margin: '0 0 8px 0' }}>Handhole #{asset.HH_ID || "N/A"}</h1>
                    <p style={{ fontSize: '14px', color: '#5f6368', margin: '0 0 16px 0' }}>Fiber Infrastructure Asset</p>

                    {/* Details List */}
                    <div style={{ marginBottom: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                        <DetailItem icon="📍" label="Ring Name" value={asset.Ring_Name || "N/A"} />
                        <DetailItem icon="✔️" label="Condition" value={asset.Condition || "N/A"} />
                        <DetailItem icon="🏷️" label="Asset ID" value={asset.HH_ID || "N/A"} />
                        {/* Add other relevant fields here */}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        <ActionButton icon="🖼️" label="View Photo" onClick={() => onImageClick(imageUrl)} />
                        <ActionButton icon="ℹ️" label="More Details" onClick={() => console.log('More details clicked')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for Detail Items
const DetailItem = ({ icon, label, value }) => (
    <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '20px', marginRight: '16px', color: '#4285F4', flexShrink: 0 }}>{icon}</span>
        <div style={{ fontSize: '14px', color: '#3c4043' }}>
            <strong style={{ display: 'block', fontWeight: 500, color: '#1f1f1f' }}>{label}</strong>
            <span style={{ color: '#5f6368' }}>{value}</span>
        </div>
    </div>
);

// Helper for Action Buttons
const ActionButton = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            cursor: 'pointer', 
            backgroundColor: '#e8f0fe', 
            color: '#1a73e8', 
            border: 'none', 
            padding: '10px 18px', 
            borderRadius: '20px', 
            fontWeight: 500, 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            whiteSpace: 'nowrap', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s',
        }}
    >
        {icon} <span style={{ marginLeft: '6px' }}>{label}</span>
    </button>
);