
import React from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react";

function MedicineRow({ name, type, qty, total, expiry, days }) {
  const percent = total ? Math.min(100, Math.max(0, (qty / total) * 100)) : 0;

  const getStatusInfo = () => {
    if (qty === 0) {
      return {
        color: "bg-rose-400",
        icon: AlertCircle,
        text: "Out of stock",
        badge: "red",
      };
    }

    if (days !== undefined && days <= 7) {
      return {
        color: "bg-amber-400",
        icon: AlertCircle,
        text: "Critical",
        badge: "amber",
      };
    }

    if (percent < 30) {
      return {
        color: "bg-orange-400",
        icon: Clock,
        text: "Low stock",
        badge: "orange",
      };
    }

    return {
      color: "bg-emerald-400",
      icon: CheckCircle,
      text: "Healthy",
      badge: "green",
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  const badgeColors = {
    red: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    orange: "border-orange-400/20 bg-orange-400/10 text-orange-300",
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  };

  const iconColors = {
    red: "text-rose-300",
    amber: "text-amber-300",
    orange: "text-orange-300",
    green: "text-emerald-300",
  };

  return (
    <div
      className="group flex items-center gap-3 rounded-2xl
        border border-white/[0.07] bg-white/[0.025]
        p-3 transition-all duration-300
        hover:border-[#00C2C7]/20 hover:bg-white/[0.045]
        sm:gap-4 sm:p-4"
    >
      {/* Status icon */}
      <div
        className="shrink-0 rounded-xl border border-white/[0.06]
          bg-white/[0.035] p-2.5 transition-colors duration-300
          group-hover:border-[#00C2C7]/15"
        title={status.text}
      >
        <StatusIcon className={`h-5 w-5 ${iconColors[status.badge]}`} />
      </div>

      {/* Medicine information */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-100 transition-colors group-hover:text-[#00C2C7] sm:text-base">
          {name}
        </h3>

        <p className="mt-0.5 truncate text-xs font-medium text-gray-400">
          {type || "Medicine"}
        </p>

        <p className="mt-1 text-[10px] text-gray-500 sm:hidden">
          {status.text}
        </p>
      </div>

      {/* Stock bar: desktop */}
      <div className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/[0.08] lg:w-32">
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.color}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-xs font-medium text-gray-400">
          {qty}/{total}
        </p>
      </div>

      {/* Expiry information */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="max-w-[100px] truncate text-right text-xs font-medium text-gray-300 sm:max-w-none sm:text-sm">
          {expiry === "No date" || !expiry ? "N/A" : expiry}
        </span>

        <span
          className={`inline-flex items-center gap-1 rounded-full
            border px-2.5 py-1 text-xs font-bold
            ${badgeColors[status.badge]}`}
          title={status.text}
        >
          {days === 999 ? "∞" : `${days}d`}
        </span>
      </div>

      {/* Stock information: mobile */}
      <div className="w-14 shrink-0 text-right sm:hidden">
        <p className="text-xs font-semibold text-gray-300">
          {qty}/{total}
        </p>

        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default MedicineRow;