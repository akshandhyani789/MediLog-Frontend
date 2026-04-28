import React from 'react';

const ThresholdSlider = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-6 w-full group">
      <input
        type="range"
        min="1"
        max="30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E293B]"
      />
      <span className="text-lg font-bold text-slate-800 min-w-[3ch]">
        {value}d
      </span>
    </div>
  );
};

export default ThresholdSlider;