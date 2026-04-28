import React from "react";

function InputField({
  label,
  type = "text",
  as = "input",
  value,
  onChange,
  placeholder,
  readOnly = false,
  required = false,
  disabled = false,
  children,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {as === "select" ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full p-2 border rounded-md outline-none transition
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-teal-400"}
          `}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          className={`w-full p-2 border rounded-md outline-none transition
            ${readOnly || disabled ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-teal-400"}
          `}
          {...props}
        />
      )}
    </div>
  );
}

export default InputField;