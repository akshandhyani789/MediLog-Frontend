import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor = "bg-white",
  valueColor = "text-gray-900",
  textColor = "text-gray-700",
  iconColor = "text-teal-600",
}) {
  return (
    <div className="group relative w-full rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      
      {/* Background with gradient overlay */}
      <div className={`absolute inset-0 ${bgColor}`}/>
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className={`relative z-10 p-5 sm:p-6 ${textColor}`}>
        
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-gray-600 uppercase letter-spacing-1">
            {title}
          </p>

          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-300">
            {Icon && <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />}
          </div>
        </div>

        {/* Value */}
        <h2 className={`text-3xl sm:text-4xl font-bold mt-4 sm:mt-5 ${valueColor} tracking-tight`}>
          {value}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
          {subtitle}
        </p>

        {/* Bottom accent bar */}
        <div className="mt-4 h-0.5 w-12 bg-gradient-to-r from-teal-600 to-transparent rounded-full" />
      </div>
    </div>
  );
}

export default StatCard;