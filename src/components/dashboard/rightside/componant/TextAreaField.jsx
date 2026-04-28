import React from "react";

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600 font-medium">
          {label}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  );
}

export default TextAreaField;