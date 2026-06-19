
// //Updated Graphs

// import { useEffect, useRef } from "react";
// import customerIcon from "/images/customers.png";

// export default function NetworkExplorerWidget({ map }) {
//   const widgetRef = useRef(null);
//   const customerMarkersRef = useRef([]);
//   const pulseIntervalsRef = useRef([]);
//   const fdtChartRef = useRef(null);
//   const fatChartRef = useRef(null);
//   const infoWindowRef = useRef(null);

//   useEffect(() => {
//     if (!map || widgetRef.current) return;

//     const loadChart = () =>
//       new Promise((res) => {
//         if (window.Chart) return res();
//         const s = document.createElement("script");
//         s.src = "https://cdn.jsdelivr.net/npm/chart.js";
//         s.onload = res;
//         document.head.appendChild(s);
//       });

//     loadChart().then(initWidget);

//     function initWidget() {
//       const container = document.createElement("div");
//       widgetRef.current = container;

//       container.style.cssText = `
//         background: rgba(15,30,70,0.95);
//         color: #fff;
//         border-radius: 20px;
//         padding: 16px;
//         width: 340px;
//         box-shadow: 0 15px 35px rgba(0,0,0,0.5);
//         font-family: Inter, Arial, sans-serif;
//         margin: 12px;
//         z-index: 9999;
//         max-height: 70vh;
//         overflow-y: auto;
//       `;

//       let collapsed = true;
//       const header = document.createElement("div");
//       header.style.cssText =
//         "display:flex;justify-content:space-between;align-items:center;font-weight:700;cursor:pointer;";
//       header.innerHTML = `
//         <span style="font-size:22px;color:#1fd9f2">📡 Network Explorer</span>
//         <span id="toggle-btn">⬇️</span>
//       `;
//       container.appendChild(header);

//       const content = document.createElement("div");
//       content.style.display = "none";
//       content.style.flexDirection = "column";
//       content.style.gap = "8px";
//       container.appendChild(content);

//       header.onclick = () => {
//         collapsed = !collapsed;
//         content.style.display = collapsed ? "none" : "flex";
//         header.querySelector("#toggle-btn").textContent = collapsed ? "➡️" : "⬇️";
//       };

//       content.innerHTML = `
//         <div style="display:flex;gap:8px;">
//           ${["OLT", "FDT", "FAT", "Customers"].map((t, i) => `
//             <div style="flex:1;text-align:center;">
//               <div style="font-size:13px;color:#ccc"><b>${t}</b></div>
//               <div id="${t.toLowerCase()}-count"
//                 style="margin-top:4px;padding:4px 10px;border-radius:999px;
//                 font-weight:700;background:${i === 3 ? "#22c55e" : "#ef4444"};
//                 color:${i === 3 ? "#000" : "#fff"}">0</div>
//             </div>`).join("")}
//         </div>

//         <select id="city-select"></select>
//         <select id="olt-select" disabled></select>
//         <select id="fdt-select" disabled></select>
//         <select id="fat-select" disabled></select>

//         <canvas id="fdt-chart" height="130"></canvas>
//         <canvas id="fat-chart" height="130"></canvas>

//         <button id="reset-network"
//           style="margin-top:6px;padding:10px;border-radius:10px;border:none;font-weight:700;background:#ba020e;color:#fff;cursor:pointer;">
//           🔄 Reset
//         </button>
//       `;

//       content.querySelectorAll("select").forEach(s => {
//         s.style.cssText = `
//           width:100%;
//           padding:8px;
//           border-radius:8px;
//           border:1px solid #555;
//           background:#1f2c50;
//           color:#fff;
//           font-weight:600;
//         `;
//       });

//       map.controls[window.google.maps.ControlPosition.RIGHT_TOP].push(container);

//       const citySelect = content.querySelector("#city-select");
//       const oltSelect = content.querySelector("#olt-select");
//       const fdtSelect = content.querySelector("#fdt-select");
//       const fatSelect = content.querySelector("#fat-select");
//       const resetBtn = content.querySelector("#reset-network");

//       const oltCount = content.querySelector("#olt-count");
//       const fdtCount = content.querySelector("#fdt-count");
//       const fatCount = content.querySelector("#fat-count");
//       const customersCount = content.querySelector("#customers-count");

//       infoWindowRef.current = new window.google.maps.InfoWindow();
//       let allNodes = [];

//       const clearMarkers = () => {
//         customerMarkersRef.current.forEach(m => m.setMap(null));
//         pulseIntervalsRef.current.forEach(i => clearInterval(i));
//         customerMarkersRef.current = [];
//         pulseIntervalsRef.current = [];
//       };

//       const parseCapacity = (val) => {
//         if (!val || !val.includes(":")) return 0;
//         const n = parseInt(val.split(":")[1]);
//         return isNaN(n) ? 0 : n;
//       };

//       const centerTextPlugin = {
//         id: "centerText",
//         afterDraw(chart) {
//           const { ctx, chartArea } = chart;
//           const used = chart.data.datasets[0].data[0];
//           const total = used + chart.data.datasets[0].data[1];
//           const pct = Math.round((used / total) * 100);
//           ctx.save();
//           ctx.fillStyle = "#fff";
//           ctx.font = "bold 16px Inter";
//           ctx.textAlign = "center";
//           ctx.fillText(`${pct}%`, (chartArea.left + chartArea.right) / 2, chartArea.top + chartArea.height / 2 - 4);
//           ctx.font = "12px Inter";
//           ctx.fillStyle = "#ccc";
//           ctx.fillText(`${used}/${total}`, (chartArea.left + chartArea.right) / 2, chartArea.top + chartArea.height / 2 + 14);
//           ctx.restore();
//         }
//       };

//       const createDonut = (ctx, used, total, label) => {
//         return new window.Chart(ctx, {
//           type: "doughnut",
//           data: {
//             labels: ["Used", "Available"],
//             datasets: [{ data: [used, Math.max(total - used, 0)], backgroundColor: ["#22c55e", "#334155"], borderWidth: 0 }]
//           },
//           options: { cutout: "55%", plugins: { title: { display: true, text: label, color: "#fff", font: { size: 13 } }, legend: { display: false } } },
//           plugins: [centerTextPlugin]
//         });
//       };

//       const createPulse = (pos) => {
//         let scale = 10, grow = true;
//         const pulse = new window.google.maps.Marker({
//           map, position: pos,
//           icon: { path: window.google.maps.SymbolPath.CIRCLE, scale, fillColor: "#ff9c03", fillOpacity: 0.6, strokeOpacity: 0 },
//           zIndex: 1
//         });
//         const i = setInterval(() => {
//           scale += grow ? 0.6 : -0.6;
//           if (scale > 14) grow = false;
//           if (scale < 6) grow = true;
//           pulse.setIcon({ path: window.google.maps.SymbolPath.CIRCLE, scale, fillColor: "#ff9c03", fillOpacity: Math.max(0.2, 1 - scale / 16), strokeWeight: 2, strokeOpacity: 0.9 });
//         }, 60);
//         pulseIntervalsRef.current.push(i);
//         customerMarkersRef.current.push(pulse);
//       };

//       citySelect.innerHTML = `<option value="">Select City</option>`;
//       fetch("http://103.31.83.47:5000/api/n_nodes").then(r => r.json()).then(data => {
//         allNodes = data;
//         [...new Set(data.map(n => n.City))].forEach(c => citySelect.innerHTML += `<option>${c}</option>`);
//       });

//       citySelect.onchange = () => { clearMarkers(); const olts = allNodes.filter(o => o.City === citySelect.value); oltCount.textContent = olts.length; oltSelect.disabled = false; oltSelect.innerHTML = `<option value="">Select OLT</option>`; olts.forEach(o => oltSelect.innerHTML += `<option value="${o.OLT_ID}">${o.OLT_Name}</option>`); };

//       oltSelect.onchange = async () => { clearMarkers(); const fdt = await fetch("http://103.31.83.47:5000/api/n_fdtPon").then(r => r.json()); const list = fdt.filter(f => f.OLT_ID === oltSelect.value); fdtCount.textContent = list.length; fdtSelect.disabled = false; fdtSelect.innerHTML = `<option value="">Select FDT</option>`; list.forEach(f => fdtSelect.innerHTML += `<option>${f.FDT_PON_Splitter_ID}</option>`); };

//       fdtSelect.onchange = async () => { clearMarkers(); const fat = await fetch("http://103.31.83.47:5000/api/n_fat_splitter").then(r => r.json()); const list = fat.filter(f => f.FDT_PON_Splitter_ID === fdtSelect.value); fatCount.textContent = list.length; fatSelect.disabled = false; fatSelect.innerHTML = `<option value="">Select FAT</option>`; list.forEach(f => fatSelect.innerHTML += `<option>${f.FAT_ID}</option>`); };

//       fatSelect.onchange = async () => {
//         clearMarkers();
//         const customers = await fetch("http://103.31.83.47:5000/api/n_customers").then(r => r.json());

//         const fdtAllCustomers = customers.filter(c => c.FDT_PON_Splitter_ID === fdtSelect.value);

//         const filtered = customers.filter(c =>
//           c.FDT_PON_Splitter_ID === fdtSelect.value &&
//           (!c.FAT_Splitter_ID || c.FAT_Splitter_ID === fatSelect.value)
//         );

//         customersCount.textContent = filtered.length;

//         const bounds = new window.google.maps.LatLngBounds();
//         filtered.forEach(c => {
//           if (!c.Latitude || !c.Longitude) return;
//           const pos = { lat: +c.Latitude, lng: +c.Longitude };
//           createPulse(pos);
//           const m = new window.google.maps.Marker({ map, position: pos, icon: { url: customerIcon, scaledSize: new window.google.maps.Size(22, 22) }, zIndex: 9999 });
//           m.addListener("click", () => infoWindowRef.current.setContent(`<div style="color:black"><b>${c.Customer_Name}</b><br/>ID: ${c.Customer_ID}</div>`) || infoWindowRef.current.open(map, m));
//           customerMarkersRef.current.push(m);
//           bounds.extend(pos);
//         });

//         if (!bounds.isEmpty()) map.fitBounds(bounds);

//         if (fdtChartRef.current) fdtChartRef.current.destroy();
//         fdtChartRef.current = createDonut(document.getElementById("fdt-chart"), fdtAllCustomers.length, 64, "FDT Capacity");

//         const fatData = await fetch("http://103.31.83.47:5000/api/n_fat_splitter").then(r => r.json());
//         const fat = fatData.find(f => f.FAT_ID === fatSelect.value);
//         const fatCap = parseCapacity(fat?.Splitter_Count);
//         const fatUsed = filtered.filter(c => c.FAT_Splitter_ID === fatSelect.value).length;

//         if (fatChartRef.current) fatChartRef.current.destroy();
//         fatChartRef.current = createDonut(document.getElementById("fat-chart"), fatUsed, fatCap, "FAT Capacity");
//       };

//       resetBtn.onclick = () => { clearMarkers(); citySelect.value = oltSelect.value = fdtSelect.value = fatSelect.value = ""; oltSelect.disabled = fdtSelect.disabled = fatSelect.disabled = true; oltCount.textContent = fdtCount.textContent = fatCount.textContent = customersCount.textContent = "0"; if (fdtChartRef.current) fdtChartRef.current.destroy(); if (fatChartRef.current) fatChartRef.current.destroy(); map.setZoom(5.5); map.panTo({ lat: 30.3753, lng: 69.3451 }); };
//     }
//   }, [map]);

//   return null;
// }




// //Code with Olt Graphs along with merged customers API
import { useEffect, useRef } from "react";
import customerIcon from "/images/customers.png";

export default function NetworkExplorerWidget({ map }) {
  const widgetRef = useRef(null);
  const customerMarkersRef = useRef([]);
  const pulseIntervalsRef = useRef([]);
  const fdtChartRef = useRef(null);
  const fatChartRef = useRef(null);
  const infoWindowRef = useRef(null);
  const oltChartRef = useRef(null);

  // CACHE REFS
  const allNodesCache = useRef([]);
  const fdtDataCache = useRef(null);
  const fatDataCache = useRef(null);
  const customerDataCache = useRef(null);

  useEffect(() => {
    if (!map || widgetRef.current) return;

    const loadChart = () =>
      new Promise((res) => {
        if (window.Chart) return res();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/chart.js";
        s.onload = res;
        document.head.appendChild(s);
      });

    loadChart().then(initWidget);

    function initWidget() {
      const container = document.createElement("div");
      widgetRef.current = container;

      container.style.cssText = `
        background: rgba(15,30,70,0.95);
        color: #fff;
        border-radius: 20px;
        padding: 16px;
        width: 340px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        font-family: Inter, Arial, sans-serif;
        margin: 12px;
        z-index: 9999;
        max-height: 70vh;
        overflow-y: auto;
      `;

      let collapsed = true;
      const header = document.createElement("div");
      header.style.cssText = "display:flex;justify-content:space-between;align-items:center;font-weight:700;cursor:pointer;";
      header.innerHTML = `
        <span style="font-size:22px;color:#1fd9f2">📡 Network Explorer</span>
        <span id="toggle-btn">⬇️</span>
      `;
      container.appendChild(header);

      const content = document.createElement("div");
      content.style.display = "none";
      content.style.flexDirection = "column";
      content.style.gap = "8px";
      container.appendChild(content);

      header.onclick = () => {
        collapsed = !collapsed;
        content.style.display = collapsed ? "none" : "flex";
        header.querySelector("#toggle-btn").textContent = collapsed ? "➡️" : "⬇️";
      };

      content.innerHTML = `
        <div style="display:flex;gap:8px;">
          ${["OLT", "FDT", "FAT", "Customers"].map((t, i) => `
            <div style="flex:1;text-align:center;">
              <div style="font-size:13px;color:#ccc"><b>${t}</b></div>
              <div id="${t.toLowerCase()}-count"
                style="margin-top:4px;padding:4px 10px;border-radius:999px;
                font-weight:700;background:${i === 3 ? "#22c55e" : "#ef4444"};
                color:${i === 3 ? "#000" : "#fff"}">0</div>
            </div>`).join("")}
        </div>
        <select id="city-select"></select>
        <select id="olt-select" disabled></select>
        <select id="fdt-select" disabled></select>
        <select id="fat-select" disabled></select>
        <canvas id="olt-chart" height="130"></canvas>
        <canvas id="fdt-chart" height="130"></canvas>
        <canvas id="fat-chart" height="130"></canvas>
        <button id="reset-network"
          style="margin-top:6px;padding:10px;border-radius:10px;border:none;font-weight:700;background:#ba020e;color:#fff;cursor:pointer;">
          🔄 Reset
        </button>
      `;

      content.querySelectorAll("select").forEach(s => {
        s.style.cssText = `width:100%;padding:8px;border-radius:8px;border:1px solid #555;background:#1f2c50;color:#fff;font-weight:600;`;
      });

      map.controls[window.google.maps.ControlPosition.RIGHT_TOP].push(container);

      const citySelect = content.querySelector("#city-select");
      const oltSelect = content.querySelector("#olt-select");
      const fdtSelect = content.querySelector("#fdt-select");
      const fatSelect = content.querySelector("#fat-select");
      const resetBtn = content.querySelector("#reset-network");
      const oltCount = content.querySelector("#olt-count");
      const fdtCount = content.querySelector("#fdt-count");
      const fatCount = content.querySelector("#fat-count");
      const customersCount = content.querySelector("#customers-count");

      infoWindowRef.current = new window.google.maps.InfoWindow();

      const clearMarkers = () => {
        customerMarkersRef.current.forEach(m => m.setMap(null));
        pulseIntervalsRef.current.forEach(i => clearInterval(i));
        customerMarkersRef.current = [];
        pulseIntervalsRef.current = [];
      };

      const parseCapacity = (val) => {
        if (!val || !val.includes(":")) return 0;
        const n = parseInt(val.split(":")[1]);
        return isNaN(n) ? 0 : n;
      };

      const centerTextPlugin = {
        id: "centerText",
        afterDraw(chart) {
          const { ctx, chartArea } = chart;
          const used = chart.data.datasets[0].data[0];
          const total = used + chart.data.datasets[0].data[1];
          const pct = total === 0 ? 0 : Math.round((used / total) * 100);
          ctx.save();
          ctx.fillStyle = "#fff";
          ctx.font = "bold 16px Inter";
          ctx.textAlign = "center";
          ctx.fillText(`${pct}%`, (chartArea.left + chartArea.right) / 2, chartArea.top + chartArea.height / 2 - 4);
          ctx.font = "12px Inter";
          ctx.fillStyle = "#ccc";
          ctx.fillText(`${used}/${total}`, (chartArea.left + chartArea.right) / 2, chartArea.top + chartArea.height / 2 + 14);
          ctx.restore();
        }
      };

      const createDonut = (ctx, used, total, label) => {
        return new window.Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Used", "Available"],
            datasets: [{ data: [used, Math.max(total - used, 0)], backgroundColor: ["#22c55e", "#334155"], borderWidth: 0 }]
          },
          options: { cutout: "55%", plugins: { title: { display: true, text: label, color: "#fff", font: { size: 13 } }, legend: { display: false } } },
          plugins: [centerTextPlugin]
        });
      };

      const createPulse = (pos, color = "#ff9c03") => {
        let scale = 10, grow = true;
        const pulse = new window.google.maps.Marker({
          map, position: pos,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale, fillColor: color, fillOpacity: 0.6, strokeOpacity: 0 },
          zIndex: 1
        });
        const i = setInterval(() => {
          scale += grow ? 0.6 : -0.6;
          if (scale > 14) grow = false;
          if (scale < 6) grow = true;
          pulse.setIcon({ path: window.google.maps.SymbolPath.CIRCLE, scale, fillColor: color, fillOpacity: Math.max(0.2, 1 - scale / 16), strokeWeight: 2, strokeOpacity: 0.9 });
        }, 60);
        pulseIntervalsRef.current.push(i);
        customerMarkersRef.current.push(pulse);
        return pulse;
      };

      // INITIAL FETCH
      citySelect.innerHTML = `<option value="">Loading Data...</option>`;
      Promise.all([
        fetch("http://103.31.83.47:5000/api/n_nodes").then(r => r.json()),
        fetch("http://103.31.83.47:5000/api/n_fdtPon").then(r => r.json()),
        fetch("http://103.31.83.47:8100/api/merged_optixcustomers_olt").then(r => r.json()),
        fetch("http://103.31.83.47:5000/api/n_fat_splitter").then(r => r.json())
      ]).then(([nodes, fdt, custRes, fat]) => {
        allNodesCache.current = nodes;
        fdtDataCache.current = fdt;
        customerDataCache.current = (custRes.data || []).map(c => ({
          ...c,
          FDT_PON_Splitter_ID: String(c.FDT_PON_Splitter_ID || "").trim(),
          FAT_Splitter_ID: String(c.FAT_Splitter_ID || "").trim()
        }));
        fatDataCache.current = fat;

        citySelect.innerHTML = `<option value="">Select City</option>`;
        [...new Set(nodes.map(n => n.City))].forEach(c => citySelect.innerHTML += `<option>${c}</option>`);
      });

      citySelect.onchange = () => { 
        clearMarkers(); 
        const olts = allNodesCache.current.filter(o => o.City === citySelect.value); 
        oltCount.textContent = olts.length; 
        oltSelect.disabled = false; 
        oltSelect.innerHTML = `<option value="">Select OLT</option>`; 
        olts.forEach(o => {
          oltSelect.innerHTML += `<option value="${o.OLT_ID}">${o.OLT_Name}</option>`;
          if (o.Latitude) createPulse({ lat: +o.Latitude, lng: +o.Longitude }, "#ef4444");
        }); 
        if (olts[0]?.Latitude) { map.setCenter({ lat: +olts[0].Latitude, lng: +olts[0].Longitude }); map.setZoom(12); }
      };

      oltSelect.onchange = () => {
        clearMarkers();
        const list = fdtDataCache.current.filter(f => f.OLT_ID === oltSelect.value);
        fdtCount.textContent = list.length;
        fdtSelect.disabled = false;
        fdtSelect.innerHTML = `<option value="">Select FDT</option>`;
        list.forEach(f => fdtSelect.innerHTML += `<option>${f.FDT_PON_Splitter_ID}</option>`);

        const oltObj = allNodesCache.current.find(o => o.OLT_ID === oltSelect.value);
        if (oltObj?.Latitude) {
          const pos = { lat: +oltObj.Latitude, lng: +oltObj.Longitude };
          createPulse(pos, "#ef4444");
          map.setCenter(pos); map.setZoom(14);
        }

        const normalize = v => String(v || "").trim().toUpperCase();
        const selectedOltName = normalize(oltObj?.OLT_Name);
        const oltCustomers = customerDataCache.current.filter(c => normalize(c.OLT_Name) === selectedOltName);
        if (oltChartRef.current) oltChartRef.current.destroy();
        oltChartRef.current = createDonut(document.getElementById("olt-chart"), oltCustomers.length, parseInt(oltObj?.OLT_Capacity || 0), "OLT Capacity");
      };

      fdtSelect.onchange = () => { 
        clearMarkers(); 
        const fdtVal = fdtSelect.value;
        const list = fatDataCache.current.filter(f => f.FDT_PON_Splitter_ID === fdtVal); 
        fatCount.textContent = list.length; 
        fatSelect.disabled = false; 
        fatSelect.innerHTML = `<option value="">Select FAT</option>`; 
        list.forEach(f => fatSelect.innerHTML += `<option>${f.FAT_ID}</option>`); 

        // ACCURATE FDT ZOOM: Find the FDT object itself for coordinates
        const fdtObj = fdtDataCache.current.find(f => f.FDT_PON_Splitter_ID === fdtVal);
        if (fdtObj?.Latitude) {
            const pos = { lat: +fdtObj.Latitude, lng: +fdtObj.Longitude };
            createPulse(pos, "#3b82f6"); 
            map.setCenter(pos); map.setZoom(16);
        } else {
            // Fallback to first customer if FDT table lacks direct coordinates
            const firstCust = customerDataCache.current.find(c => c.FDT_PON_Splitter_ID === fdtVal);
            if (firstCust?.Latitude) {
                const pos = { lat: +firstCust.Latitude, lng: +firstCust.Longitude };
                createPulse(pos, "#3b82f6");
                map.setCenter(pos); map.setZoom(16);
            }
        }
      };

      fatSelect.onchange = () => {
        clearMarkers();
        const fdtVal = String(fdtSelect.value).trim();
        const fatVal = String(fatSelect.value).trim();
        const filtered = customerDataCache.current.filter(c => c.FDT_PON_Splitter_ID === fdtVal && (!c.FAT_Splitter_ID || c.FAT_Splitter_ID === fatVal));
        customersCount.textContent = filtered.length;

        const bounds = new window.google.maps.LatLngBounds();
        filtered.forEach(c => {
          if (!c.Latitude) return;
          const pos = { lat: +c.Latitude, lng: +c.Longitude };
          createPulse(pos, "#22c55e");
          const m = new window.google.maps.Marker({ map, position: pos, icon: { url: customerIcon, scaledSize: new window.google.maps.Size(4, 4) }, zIndex: 9999 });
          m.addListener("click", () => {
            infoWindowRef.current.setContent(`<div style="color:black"><b>${c.Customer_Name}</b><br/>ID: ${c.Customer_ID}</div>`);
            infoWindowRef.current.open(map, m);
          });
          customerMarkersRef.current.push(m);
          bounds.extend(pos);
        });

        // Highlight FAT accurately
        const fatObj = fatDataCache.current.find(f => String(f.FAT_ID).trim() === fatVal);
        if (fatObj?.Latitude) {
            createPulse({ lat: +fatObj.Latitude, lng: +fatObj.Longitude }, "#f59e0b");
        } else if (filtered[0]?.Latitude) {
            createPulse({ lat: +filtered[0].Latitude, lng: +filtered[0].Longitude }, "#f59e0b");
        }

        if (!bounds.isEmpty()) map.fitBounds(bounds);
        if (fdtChartRef.current) fdtChartRef.current.destroy();
        fdtChartRef.current = createDonut(document.getElementById("fdt-chart"), customerDataCache.current.filter(c => c.FDT_PON_Splitter_ID === fdtVal).length, 64, "FDT Capacity");
        const fatCap = parseCapacity(fatObj?.Splitter_Count);
        if (fatChartRef.current) fatChartRef.current.destroy();
        fatChartRef.current = createDonut(document.getElementById("fat-chart"), filtered.length, fatCap, "FAT Capacity");
      };

      resetBtn.onclick = () => {
        clearMarkers();
        citySelect.value = oltSelect.value = fdtSelect.value = fatSelect.value = "";
        oltSelect.disabled = fdtSelect.disabled = fatSelect.disabled = true;
        oltCount.textContent = fdtCount.textContent = fatCount.textContent = customersCount.textContent = "0";
        if (oltChartRef.current) oltChartRef.current.destroy();
        if (fdtChartRef.current) fdtChartRef.current.destroy();
        if (fatChartRef.current) fatChartRef.current.destroy();
        map.setZoom(5.5); map.setCenter({ lat: 30.3753, lng: 69.3451 });
      };
    }
  }, [map]);

  return null;
}