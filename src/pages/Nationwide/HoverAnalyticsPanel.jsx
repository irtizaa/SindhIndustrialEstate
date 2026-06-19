import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:5000/api";
const CUSTOMERS_API = "http://localhost:4000/api/merged_optixcustomers_olt";



const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export default function MapHoverAnalytics({ hoveredFeature }) {
  const [customers, setCustomers] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [fiber, setFiber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [manualClose, setManualClose] = useState(false);

  useEffect(() => {
  if (hoveredFeature) {
    setVisible(!manualClose); // open panel only if user didn’t manually close previous one
    setManualClose(false); // reset manual close for new hover
  }
}, [hoveredFeature]);
  // -------------------- Fetch Data --------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, nodeRes, fiberRes] = await Promise.all([
          axios.get(CUSTOMERS_API),
          axios.get(`${API}/n_nodes`),
          axios.get(`${API}/n_metrofiber`),
        ]);
        // setCustomers(custRes.data || []);
        // setNodes(nodeRes.data || []);
        // setFiber(fiberRes.data || []);
        setCustomers(custRes.data?.data || []);
      setNodes(nodeRes.data || []);
      setFiber(fiberRes.data || []);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -------------------- Filter Data by City --------------------
  const cityName = hoveredFeature?.data?.City || "Unknown";

//   const scopedCustomers = useMemo(
//     () => customers.filter((c) => c.City === cityName),
//     [customers, cityName]
//   );
const scopedCustomers = useMemo(() => {
  if (!cityName) return [];
  return customers.filter((c) =>
    c.City?.trim().toLowerCase() === cityName.trim().toLowerCase()
  );
}, [customers, cityName]);


const scopedNodes = useMemo(() => {
  if (!cityName) return [];
  return nodes.filter((n) =>
    n.City?.trim().toLowerCase() === cityName.trim().toLowerCase()
  );
}, [nodes, cityName]);

const scopedFiber = useMemo(() => {
  if (!cityName) return [];
  return fiber.filter((f) =>
    f.City?.trim().toLowerCase() === cityName.trim().toLowerCase()
  );
}, [fiber, cityName]);
  // -------------------- Stats --------------------
  const customerStats = useMemo(() => {
    const total = scopedCustomers.length;
    const byArea = {};
    scopedCustomers.forEach((c) => {
      const key = c.Ring_Name || "Unknown";
      byArea[key] = (byArea[key] || 0) + 1;
    });
    const byAreaData = Object.entries(byArea).map(([name, value]) => ({
      name,
      value,
    }));
    return { total, byAreaData };
  }, [scopedCustomers]);

  const nodeStats = useMemo(() => {
    const total = scopedNodes.length;
    const byType = {};
    scopedNodes.forEach((n) => {
      const key = n.OLT_Name || "Unknown";
      byType[key] = (byType[key] || 0) + 1;
    });
    const byTypeData = Object.entries(byType).map(([name, value]) => ({
      name,
      value,
    }));
    return { total, byTypeData };
  }, [scopedNodes]);

  const fiberStats = useMemo(() => {
    const totalLength = scopedFiber.reduce(
      (sum, f) => sum + (f.Calculated_Length || 0),
      0
    );

    // Group by Ring_Name instead of City
    const byRing = {};
    scopedFiber.forEach((f) => {
      const key = f.Ring_Name || "Unknown";
      byRing[key] = (byRing[key] || 0) + (f.Calculated_Length || 0);
    });

    const byRingData = Object.entries(byRing).map(([name, value]) => ({
      name,
      value: Math.round(value / 1000), // km
    }));

    return { totalLength: Math.round(totalLength / 1000), byRingData };
  }, [scopedFiber]);

  if (!hoveredFeature || !visible) return null;
// if (!hoveredFeature) return null; // only hide if nothing is hovered

  // -------------------- Loading Placeholder --------------------
  if (loading)
    return (
      <div style={styles.panel}>
        <div style={styles.header}>
          <div>{cityName} Analytics</div>
          {/* <button style={styles.closeBtn} onClick={() => setVisible(false)}>
            ✕
          </button> */}
          <button
  style={styles.closeBtn}
  onClick={() => {
    setVisible(false);
    setManualClose(true); // mark as manually closed
  }}
>
  ✕
</button>

        </div>
        <p>Loading data...</p>
      </div>
    );

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>{cityName} Analytics</div>
        <button style={styles.closeBtn} onClick={() => setVisible(false)}>
          ✕
        </button>
      </div>

      {/* Customers */}
      {scopedCustomers.length > 0 && (
        <>
          <StatCard title="Total Customers" value={customerStats.total} />
          <ChartCard title="Customers by Ring Name">                                            
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={customerStats.byAreaData}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#6366f1"                                            
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      {/* Nodes */}
      {scopedNodes.length > 0 && (
        <>
          <StatCard title="Total Nodes" value={nodeStats.total} />
          <ChartCard title="Nodes by Name">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={nodeStats.byTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  isAnimationActive={true}
                >
                  {nodeStats.byTypeData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      {/* Fiber */}
      {scopedFiber.length > 0 && (
        <>
          <StatCard title="Total Fiber Length (km)" value={fiberStats.totalLength} />
          <ChartCard title="Fiber by Ring">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={fiberStats.byRingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  type="monotone"
                  dataKey="value"
                  fill="#6366f1"    
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}
    </div>
  );
}

// -------------------- Helper Components --------------------
const StatCard = ({ title, value }) => (
  <div style={styles.card}>
    <small>{title}</small>
    <h3>{value}</h3>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={styles.card}>
    <small>{title}</small>
    {children}
  </div>
);

// -------------------- Styles --------------------
const styles = {

  panel: {
    position: "fixed",
    top: 240,
    right: 50,
    width: 400,
    
    // background: "#060c27ff",
  background: "rgba(255,255,255,0.08)",
  //  background:
  //   "linear-gradient(transparent, transparent) padding-box," +
  //   "linear-gradient(135deg, #4a5cff, #00eaff) border-box",
    color: "rgb(4, 4, 13)",               
    borderRadius: 16,
    padding: 14,
    zIndex: 999,
    fontFamily: "sans-serif",
    overflowY: "auto",
    maxHeight: "60vh",
    borderWidth: 1,border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 20px rgba(74,92,255,0.4)",
    borderStyle: "solid",
    borderColor: "#4a5cff",  
    transition: "border 0.3s ease",

  },

  panelHover: {
  border: "1px solid rgba(74,92,255,0.8)",
},

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
  },
  
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#f40505ff",
    fontSize: 18,
    cursor: "pointer",
  },

  card: {
    background: "transparent",
    // background: "rgba(15,30,70,0.95)",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
      border: "1px solid #2b2f6a",

  },

};
