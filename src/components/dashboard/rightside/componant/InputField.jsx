
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
  const baseClass = `
    w-full min-w-0 rounded-xl border border-white/10
    bg-white px-4 py-3
    text-sm font-medium text-slate-900
    placeholder:text-gray-500
    outline-none transition duration-200
    focus:border-teal-400/60
    focus:ring-2 focus:ring-teal-400/10
    disabled:cursor-not-allowed disabled:opacity-50
    read-only:cursor-default
    [color-scheme:light]
  `;

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-semibold text-gray-200"
        >
          {label}
          {required && (
            <span className="ml-1 text-teal-300">*</span>
          )}
        </label>
      )}

      {as === "select" ? (
        <select
          id={props.id || props.name}
          name={props.name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={baseClass}
          {...props}
        >
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={props.id || props.name}
          name={props.name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          rows={props.rows || 3}
          className={baseClass}
          {...props}
        />
      ) : (
        <input
          id={props.id || props.name}
          name={props.name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          className={baseClass}
          {...props}
        />
      )}
    </div>
  );
}

export default InputField;
