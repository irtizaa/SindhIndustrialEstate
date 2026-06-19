// src/components/CustomerDetail.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Assuming React Router is used

const BACKEND_URL = 'http://localhost:3000';
const POLLING_INTERVAL = 15000; // Poll every 15 seconds for live status

const StatusBadge = ({ status }) => {
    const baseStyle = "px-4 py-2 rounded-full font-bold shadow-md transition duration-300";
    if (status === 'Online') {
        return <span className={`${baseStyle} bg-green-600 text-white animate-pulse`}>🟢 LIVE - Online</span>;
    }
    if (status === 'Offline') {
        return <span className={`${baseStyle} bg-red-600 text-white`}>🔴 OFFLINE</span>;
    }
    return <span className={`${baseStyle} bg-gray-500 text-white`}>❓ Status Unknown</span>;
};

const SignalCard = ({ title, value, unit, threshold }) => {
    const numValue = parseFloat(value);
    const isWarning = !isNaN(numValue) && numValue < threshold;
    const color = isWarning ? 'bg-red-800 border-red-500' : 'bg-green-800 border-green-500';

    return (
        <div className={`p-4 rounded-lg shadow-xl ${color} border-l-4`}>
            <div className="text-sm font-medium text-gray-300">{title}</div>
            <div className={`text-3xl font-extrabold mt-1 ${isWarning ? 'text-yellow-300' : 'text-green-300'}`}>
                {isNaN(numValue) ? 'N/A' : `${value} ${unit}`}
            </div>
            {isWarning && <p className="text-xs text-yellow-300 mt-1">⚠️ Signal below ideal threshold of {threshold} {unit}.</p>}
        </div>
    );
};


const CustomerDetail = () => {
    const { customer_id } = useParams(); // Get ID from URL
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔑 useEffect for LIVE POLLING
    useEffect(() => {
        const fetchLiveStatus = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/onu/live-status/${customer_id}`);
                setLiveData(response.data.data);
            } catch (error) {
                console.error("Error fetching live data:", error);
                setLiveData({ status: 'Error', message: 'API check failed.' });
            } finally {
                setLoading(false);
            }
        };

        // Fetch immediately on component mount
        fetchLiveStatus(); 

        // Set up the polling interval
        const intervalId = setInterval(fetchLiveStatus, POLLING_INTERVAL);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [customer_id]); // Re-run if the customer ID changes

    const onuDetails = liveData?.onu || liveData;
    const customerInfo = liveData?.customer; // Assuming the live API returns the customer record too, if needed

    if (loading) {
        return <div className="text-center text-lg mt-10">Fetching Live Status for Customer {customer_id}...</div>;
    }

    if (!onuDetails || onuDetails.status === 'Error') {
        return <div className="text-center text-lg mt-10 text-red-500">Error: Could not retrieve live ONU data for ID {customer_id}.</div>;
    }

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 mb-6 block">← Back to Dashboard</Link>
            
            <h1 className="text-4xl font-extrabold mb-3 text-indigo-400">Customer ID: {customer_id}</h1>
            <h2 className="text-2xl font-semibold mb-6 text-gray-300">{onuDetails.Customer_Name || "Customer Detail View"}</h2>
            
            <hr className="my-6 border-gray-700" />

            {/* 1. LIVE STATUS & HEALTH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-gray-800 rounded-lg shadow-xl lg:col-span-1">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Connection Status</h3>
                    <StatusBadge status={onuDetails.status} />
                </div>
                
                {/* RX Signal (Downstream - Critical for Service) */}
                <SignalCard 
                    title="RX Power (1490nm)" 
                    value={onuDetails.signal_1490} 
                    unit="dBm" 
                    threshold={-27} 
                />
                
                {/* TX Signal (Upstream) */}
                <SignalCard 
                    title="TX Power (1310nm)" 
                    value={onuDetails.signal_1310} 
                    unit="dBm" 
                    threshold={-5} // TX power close to 0 is generally better
                />
            </div>

            {/* 2. CONFIGURATION DETAILS */}
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Configuration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h4 className="text-lg font-bold mb-3 text-gray-300">Hardware & Location</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>**Serial Number (SN):** <span className="text-white">{onuDetails.sn}</span></li>
                        <li>**ONU Model:** <span className="text-white">{onuDetails.onu_type_name}</span></li>
                        <li>**OLT Name:** <span className="text-white">{onuDetails.olt_name}</span></li>
                        <li>**PON Location:** <span className="text-white">{onuDetails.board}/{onuDetails.port}/{onuDetails.onu}</span></li>
                        <li>**WAN Mode:** <span className="text-white">{onuDetails.mode} ({onuDetails.wan_mode})</span></li>
                    </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h4 className="text-lg font-bold mb-3 text-gray-300">Provisioned Services</h4>
                    <table className="min-w-full divide-y divide-gray-700 text-sm">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="py-2 text-left font-medium text-gray-400">VLAN</th>
                                <th className="py-2 text-left font-medium text-gray-400">Up Speed</th>
                                <th className="py-2 text-left font-medium text-gray-400">Down Speed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-gray-300">
                            {(onuDetails.service_ports || []).map((port, index) => (
                                <tr key={index}>
                                    <td className="py-2">{port.vlan || '-'}</td>
                                    <td className="py-2">{port.upload_speed}</td>
                                    <td className="py-2">{port.download_speed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;