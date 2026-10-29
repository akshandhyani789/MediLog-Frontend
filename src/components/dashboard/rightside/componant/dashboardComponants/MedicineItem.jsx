
import React from "react";

function MedicineItem({ name, subtitle, days }) {
  const statusColor =
    days <= 0
      ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
      : days <= 7
      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

  return (
    <div
      className="group flex min-h-[60px] items-center justify-between gap-3
        rounded-xl border border-white/[0.06]
        bg-white/[0.025] p-3
        transition-all duration-300
        hover:border-[#00C2C7]/20
        hover:bg-white/[0.045]
        sm:min-h-[70px] sm:p-4"
    >
      {/* Medicine details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-100 transition-colors group-hover:text-[#00C2C7] sm:text-base">
          {name}
        </p>

        <p className="mt-1 truncate text-xs text-gray-400 sm:text-sm">
          {subtitle}
        </p>
      </div>

      {/* Expiry status */}
      <span
        className={`ml-2 shrink-0 rounded-full border px-2.5 py-1
          text-xs font-semibold whitespace-nowrap sm:text-sm
          ${statusColor}`}
      >
        {days <= 0 ? "Expired" : `${days}d`}
      </span>
    </div>
  );
}

export default MedicineItem;
