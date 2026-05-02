import React from "react";

const DataField = ({
  label,
  value = "",
  isEditing,
  onChange,
  isDisable = false,
  type = "text",
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-400 mb-1">{label}</label>

      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisable}
          className={`border-b border-gray-300 focus:outline-none focus:border-teal-600 text-lg font-medium text-slate-900 bg-transparent transition pb-2
            ${isDisable ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      ) : (
        <p className="text-lg font-medium text-slate-900 border-b border-gray-200 pb-2">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
};

export default DataField;