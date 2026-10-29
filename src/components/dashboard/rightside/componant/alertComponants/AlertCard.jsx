import { ChevronRight } from "lucide-react";

function AlertCard({ alert, onCheck }) {
  const Icon = alert.icon;
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={`group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border hover:shadow-sm transition-all duration-300 my-3 ${
        isCritical
          ? "bg-[#FEE2E2] border-[#FECACA] hover:border-[#DC2626]"
          : "bg-[#FEF3C7] border-[#FDE68A] hover:border-[#B45309]"
      }`}
    >
      <input
        type="checkbox"
        onChange={() => onCheck(alert.id)}
        className="mt-1 w-5 h-5 accent-teal-600 cursor-pointer"
      />

      <div
        className={`p-2.5 rounded-xl flex-shrink-0 ${
          isCritical ? "bg-[#FEE2E2]" : "bg-[#FEF3C7]"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-5 h-5 ${
              isCritical ? "text-[#DC2626]" : "text-[#B45309]"
            }`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold ${
            isCritical ? "text-[#DC2626]" : "text-[#B45309]"
          }`}
        >
          {alert.title}
        </h3>

        <p
          className={`text-sm mt-1 ${
            isCritical ? "text-[#DC2626]" : "text-[#B45309]"
          }`}
        >
          {alert.message}
        </p>
      </div>

      <ChevronRight
        className={`w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform ${
          isCritical ? "text-[#DC2626]" : "text-[#B45309]"
        }`}
      />
    </div>
  );
}

export default AlertCard;