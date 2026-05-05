import { ChevronRight } from "lucide-react";

function AlertCard({ alert, onCheck }) {
  const Icon = alert.icon;
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={`group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border hover:shadow-sm transition-all duration-300 my-3 ${
        isCritical
          ? "bg-red-50 border-red-200 hover:border-red-300"
          : "bg-amber-50 border-amber-200 hover:border-amber-300"
      }`}
    >
      <input
        type="checkbox"
        onChange={() => onCheck(alert.id)}
        className="mt-1 w-5 h-5 accent-teal-600 cursor-pointer"
      />

      <div
        className={`p-2.5 rounded-xl flex-shrink-0 ${
          isCritical ? "bg-red-100" : "bg-amber-100"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-5 h-5 ${
              isCritical ? "text-red-600" : "text-amber-600"
            }`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold ${
            isCritical ? "text-red-900" : "text-amber-900"
          }`}
        >
          {alert.title}
        </h3>

        <p
          className={`text-sm mt-1 ${
            isCritical ? "text-red-700" : "text-amber-700"
          }`}
        >
          {alert.message}
        </p>
      </div>

      <ChevronRight
        className={`w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform ${
          isCritical ? "text-red-400" : "text-amber-400"
        }`}
      />
    </div>
  );
}

export default AlertCard;