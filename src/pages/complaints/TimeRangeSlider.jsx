import { useState } from "react";

export default function TimeRangeSlider({ min = 0, max = 168, value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e) => {
    const newVal = Number(e.target.value);
    setLocalValue(newVal);
    onChange(newVal);
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow mb-3">
      <label className="text-sm font-semibold">Filter by complaint age (hours)</label>

      <input
        type="range"
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        className="w-full"
      />

      <div className="text-xs mt-1 font-medium text-gray-600">
        {localValue} hours
      </div>
    </div>
  );
}
