import React from "react";
import { AlertCircle, CheckCircle, Clock, Package } from "lucide-react";

function MedicineRow({ name, type, qty, total, expiry, days }) {

  const percent = total ? (qty / total) * 100 : 0;

  const getStatusInfo = () => {
    if (qty === 0) return { color: "bg-red-500", icon: AlertCircle, text: "Out of stock", badge: "red" };
    if (days !== undefined && days <= 7) return { color: "bg-amber-500", icon: AlertCircle, text: "Critical", badge: "amber" };
    if (percent < 30) return { color: "bg-orange-500", icon: Clock, text: "Low stock", badge: "orange" };
    return { color: "bg-green-500", icon: CheckCircle, text: "Healthy", badge: "green" };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  const badgeColors = {
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className="group flex items-center gap-3 p-4 sm:p-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300">

      {/* Status Indicator */}
      <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
        <StatusIcon className={`w-5 h-5 text-${status.badge}-600`} style={{ color: status.color }} />
      </div>

      {/* Medicine Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
          {name}
        </h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {type}
        </p>
      </div>

      {/* Stock Bar (Desktop) */}
      <div className="hidden sm:flex flex-col items-center gap-1">
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 font-medium">
          {qty}/{total}
        </p>
      </div>

      {/* Expiry Info */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs sm:text-sm font-medium text-gray-900">
          {expiry === "No date" ? "N/A" : expiry}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badgeColors[status.badge]}`}>
          {days === 999 ? "∞" : `${days}d`}
        </span>
      </div>

      {/* Stock info (Mobile) */}
      <div className="sm:hidden text-right">
        <p className="text-xs font-semibold text-gray-900">
          {qty}/{total}
        </p>
        <div className="w-20 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
          <div
            className={`h-full rounded-full ${status.color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default MedicineRow;