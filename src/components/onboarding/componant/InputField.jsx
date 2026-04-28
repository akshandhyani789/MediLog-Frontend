const InputField = ({
  label,
  placeholder,
  helperText,
  onChange,   // ✅ FIXED
  value,
  name,       // ✅ ADD THIS
  type = "text",
  ...props
}) => {
  return (
    <div className="mb-6 w-full text-left">
      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
        {label}
      </label>

      <input 
        {...props}
        type={type}
        name={name}                 // ✅ IMPORTANT
        onChange={onChange}         // ✅ FIXED
        value={value || ""}         // ✅ prevent undefined bug
        placeholder={placeholder}
        className="w-full bg-[#E8EDEB] border-none rounded-2xl py-4 px-6 text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-[#00695C] outline-none transition-all"
        required
      />

      {helperText && (
        <p className="mt-2 ml-1 text-[11px] text-gray-400 font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default InputField;