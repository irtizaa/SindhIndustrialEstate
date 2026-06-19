import React, { useState, useEffect, useRef } from "react";
import { 
  Navigation, MapPin, Trash2, Clock, Zap, X, Play, Car, Footprints, Activity 
} from "lucide-react";

export default function FindRoute({ map }) {
  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [travelMode, setTravelMode] = useState("DRIVING");
  
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const markersRef = useRef([]);
  const controlWrapperRef = useRef(null);

  // STAGE 1: Dock the widget into the native Google Maps Control UI
  useEffect(() => {
    if (!map || !controlWrapperRef.current) return;

    // Use RIGHT_TOP to place it exactly below the default Fullscreen/Zoom buttons
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(controlWrapperRef.current);
    
    directionsService.current = new window.google.maps.DirectionsService();
    directionsRenderer.current = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: travelMode === "DRIVING" ? "#00fff7" : "#ffcc00",
        strokeWeight: 6,
        strokeOpacity: 0.8,
      }
    });
  }, [map]);

  // Handle travel mode color changes
  useEffect(() => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setOptions({
        polylineOptions: {
          strokeColor: travelMode === "DRIVING" ? "#00fff7" : "#ffcc00",
          strokeWeight: 6,
          strokeOpacity: 0.8,
        }
      });
    }
  }, [travelMode]);

  useEffect(() => {
    if (!map || !isSelecting) return;

    const listener = map.addListener("click", (e) => {
      const marker = new window.google.maps.Marker({
        position: e.latLng,
        map: map,
        animation: window.google.maps.Animation.DROP,
        label: { text: (points.length + 1).toString(), color: "white", fontWeight: "bold", fontSize: "10px" },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#5348ec",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
          scale: 10,
        }
      });
      markersRef.current.push(marker);
      setPoints(prev => [...prev, { lat: e.latLng.lat(), lng: e.latLng.lng(), id: Date.now() }]);
    });
    return () => window.google.maps.event.removeListener(listener);
  }, [map, isSelecting, points]);

  const calculateAdvancedRoute = () => {
    if (points.length < 2) return;
    directionsService.current.route({
      origin: new window.google.maps.LatLng(points[0].lat, points[0].lng),
      destination: new window.google.maps.LatLng(points[points.length-1].lat, points[points.length-1].lng),
      waypoints: points.slice(1, -1).map(p => ({ location: new window.google.maps.LatLng(p.lat, p.lng), stopover: true })),
      travelMode: window.google.maps.TravelMode[travelMode],
    }, (result, status) => {
      if (status === "OK") {
        directionsRenderer.current.setDirections(result);
        const leg = result.routes[0].legs[0];
        setRouteInfo({ distance: leg.distance.text, duration: leg.duration.text });
        setIsSelecting(false);
      }
    });
  };

  const resetAll = () => {
    setPoints([]); setRouteInfo(null); setIsSelecting(false);
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (directionsRenderer.current) directionsRenderer.current.setDirections({ routes: [] });
  };

  return (
    /* The Wrapper: This is what Google Maps manages. We add a margin to keep it separate from the Fullscreen button. */
<div ref={controlWrapperRef} className="relative mr-[10px] mt-[10px]">
  <div className="absolute top-0 left-0">
        {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-[40px] h-[40px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.3)] rounded-[2px] border-none flex items-center justify-center hover:bg-[#f4f4f4] transition-colors"
        >
          <Navigation size={22} className="text-[#0a0641]" />
        </button>
      ) : (
        <div className="w-80 bg-[#0b1624] border border-[#00fff7]/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden text-white">
          {/* NOC Header */}
          <div className="bg-[#0F2A4D] p-3 flex justify-between items-center border-b border-[#00fff7]/10">
            <div className="flex items-center gap-2 text-[#00fff7]">
              <Zap size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Route Intelligence</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-500/20 p-1 rounded transition-colors text-gray-400">
              <X size={18} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Mode Switcher */}
            <div className="flex bg-black/40 rounded-xl p-1 gap-1 border border-white/5">
              <button onClick={() => setTravelMode("DRIVING")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${travelMode === "DRIVING" ? 'bg-[#00fff7] text-[#0b1624]' : 'text-gray-400 hover:text-white'}`}>
                <Car size={14} /><span className="text-[10px] font-bold text-inherit">VEHICLE</span>
              </button>
              <button onClick={() => setTravelMode("WALKING")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${travelMode === "WALKING" ? 'bg-[#ffcc00] text-[#0b1624]' : 'text-gray-400 hover:text-white'}`}>
                <Footprints size={14} /><span className="text-[10px] font-bold text-inherit">FIELD</span>
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setIsSelecting(!isSelecting)} className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${isSelecting ? 'bg-pink-600 border-pink-400' : 'bg-white/5 border-white/10'}`}>
                {isSelecting ? "STOP PICKING" : "ADD POINTS"}
              </button>
              <button onClick={calculateAdvancedRoute} disabled={points.length < 2} className="bg-gradient-to-r from-[#00fff7] to-blue-500 text-[#0b1624] font-black text-[10px] rounded-lg disabled:opacity-30">
                CALCULATE
              </button>
            </div>

            {/* Fixed-Height Scrollable Point List: Stops the widget from jumping/expanding */}
            {points.length > 0 && (
              <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar border-t border-white/5 pt-2">
                {points.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/5 text-[9px]">
                    <span className="text-[#00fff7] font-bold">Stop 0{i+1}</span>
                    <span className="text-gray-400">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Analysis Results */}
            {routeInfo && (
              <div className="p-3 bg-gradient-to-br from-[#00fff7]/10 to-transparent border border-[#00fff7]/20 rounded-xl">
                <div className="flex justify-between items-end text-white">
                  <div>
                    <div className="text-[8px] text-gray-400 uppercase font-black">Analyzed Distance</div>
                    <div className="text-2xl font-black text-[#00fff7] leading-none">{routeInfo.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-gray-400 uppercase font-bold flex items-center justify-end gap-1">Est. Time</div>
                    <div className="text-xs font-bold">{routeInfo.duration}</div>
                  </div>
                </div>
              </div>
            )}

            {points.length > 0 && (
              <button onClick={resetAll} className="w-full py-1 text-[9px] font-bold text-red-400 hover:text-red-300 transition-colors">
                CLEAR MAP DATA
              </button>
            )}
          </div>
        </div>
      )}
    </div></div>
  );
}