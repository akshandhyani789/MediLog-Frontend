
import React from "react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  bgColor,
  valueColor = "text-gray-100",
  textColor = "text-gray-300",
  iconColor = "text-[#00C2C7]",
}) {
  return (
    <div
      className="group relative w-full overflow-hidden rounded-2xl
        border border-white/[0.09]
        bg-white/[0.035]
        shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        backdrop-blur-2xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#00C2C7]/30
        hover:shadow-[0_8px_30px_rgba(0,194,199,0.06)]"
    >
      {/* Optional background color layer */}
      {bgColor && (
        <div
          className={`pointer-events-none absolute inset-0 ${bgColor}`}
        />
      )}

      {/* Subtle teal glow on hover */}
      <div
        className="pointer-events-none absolute -right-12 -top-12
          h-32 w-32 rounded-full bg-[#00C2C7]/[0.06]
          opacity-50 blur-3xl transition-opacity duration-300
          group-hover:opacity-100"
      />

      {/* Content */}
      <div className={`relative z-10 p-5 sm:p-6 ${textColor}`}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <p
            className="text-xs font-semibold uppercase tracking-[0.14em]
              text-gray-400 sm:text-sm"
          >
            {title}
          </p>

          <div
            className="shrink-0 rounded-xl
              border border-[#00C2C7]/20
              bg-[#00C2C7]/[0.08] p-2.5
              transition-all duration-300
              group-hover:border-[#00C2C7]/35
              group-hover:bg-[#00C2C7]/[0.13]"
          >
            {Icon && (
              <Icon
                className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`}
              />
            )}
          </div>
        </div>

        {/* Value */}
        <h2
          className={`mt-4 text-3xl font-bold tracking-tight
            sm:mt-5 sm:text-4xl ${valueColor}`}
        >
          {value}
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-xs font-medium text-gray-400 sm:text-sm">
          {subtitle}
        </p>

        {/* Teal accent bar */}
        <div
          className="mt-5 h-[2px] w-12 rounded-full
            bg-gradient-to-r from-[#00C2C7] to-transparent
            transition-all duration-300
            group-hover:w-20"
        />
      </div>
    </div>
  );
}

export default StatCard;