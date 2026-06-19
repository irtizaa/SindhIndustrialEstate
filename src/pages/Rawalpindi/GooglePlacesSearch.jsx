// GoogleSearch.js
import React, { useEffect, useRef, useState } from "react";

const GoogleSearch = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    function initAutocomplete() {
      if (inputRef.current) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] } // You can change types if needed
        );

        autocompleteInstance.addListener("place_changed", () => {
          const place = autocompleteInstance.getPlace();
          if (onPlaceSelected) onPlaceSelected(place);
        });

        setAutocomplete(autocompleteInstance);
      }
    }
  }, []);

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Search a place"
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default GoogleSearch;
