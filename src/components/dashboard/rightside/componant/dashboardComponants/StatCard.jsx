import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor = "bg-[#ffffff]",
  valueColor = "text-[#000000]",
  textColor = "text-[#2e3131]",
  iconColor = "text-[#0F766E]",
}) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md group">
      
      {/* Background Image */}
     

      {/* Teal Overlay */}
      <div className={`absolute inset-0 ${bgColor} transition duration-300`}/>

      {/* Content */}
      <div className={`relative z-10 p-4 ${textColor}`}>
        
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <p className="text-[10px] sm:text-xs font-semibold tracking-wider opacity-80">
            {title}
          </p>

          <div className="p-2 rounded-lg">
            {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
          </div>
        </div>

        {/* Value */}
        <h2 className={`text-2xl sm:text-3xl font-bold mt-3 ${valueColor}`}>
          {value}
        </h2>

        {/* Subtitle */}
        <p className="text-xs mt-1 opacity-80">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default StatCard;