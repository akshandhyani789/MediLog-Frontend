
import React, { useMemo } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

// Calculate medicine expiry risk
const getRiskLevel = (expiryDate) => {
  if (!expiryDate) return "UNKNOWN";

  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffDays = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "HIGH";
  if (diffDays <= 7) return "HIGH";
  if (diffDays <= 30) return "SOON";

  return "SAFE";
};

function RiskChart({ medicines = [] }) {
  // Aggregate risk data
  const riskData = useMemo(() => {
    const riskMap = {
      SAFE: 0,
      SOON: 0,
      HIGH: 0,
    };

    medicines.forEach((med) => {
      const risk = getRiskLevel(med.expiryDate);

      if (riskMap[risk] !== undefined) {
        riskMap[risk]++;
      }
    });

    return [
      {
        name: "Safe",
        value: riskMap.SAFE,
        color: "#15803D",
        icon: CheckCircle,
        iconColor: "text-[#15803D]",
        textColor: "text-[#15803D]",
        borderColor: "border-[#86EFAC]",
        bgColor: "bg-[#DCFCE7]",
      },
      {
        name: "Expiring Soon",
        value: riskMap.SOON,
        color: "#B45309",
        icon: Clock,
        iconColor: "text-[#B45309]",
        textColor: "text-[#B45309]",
        borderColor: "border-[#FDE68A]",
        bgColor: "bg-[#FEF3C7]",
      },
      {
        name: "High Risk",
        value: riskMap.HIGH,
        color: "#DC2626",
        icon: AlertCircle,
        iconColor: "text-[#DC2626]",
        textColor: "text-[#DC2626]",
        borderColor: "border-[#FECACA]",
        bgColor: "bg-[#FEE2E2]",
      },
    ];
  }, [medicines]);

  const total = useMemo(
    () => riskData.reduce((sum, item) => sum + item.value, 0),
    [riskData]
  );

  return (
    <div
      className="relative h-full overflow-hidden rounded-3xl
        border border-white/[0.09] bg-white/[0.035]
        p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        backdrop-blur-2xl transition-all duration-300
        hover:border-[#00C2C7]/25 sm:p-8"
    >
      {/* Ambient teal glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#00C2C7]/[0.06] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-[#00C2C7]/20 bg-[#00C2C7]/[0.08] p-2">
            <AlertCircle className="h-5 w-5 text-[#00C2C7]" />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-gray-100 sm:text-xl">
            Medicine Risk Overview
          </h2>
        </div>

        <p className="mt-2 text-sm font-medium text-gray-400">
          Health status by expiry dates
        </p>
      </div>

      {/* Total medicines */}
      <div className="relative mb-6 flex items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-6">
        <div className="text-center">
          <div className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            {total}
          </div>

          <div className="mt-2 text-sm font-medium text-gray-400">
            Total Medicines
          </div>

          <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-[#00C2C7]" />
        </div>
      </div>

      {/* Risk cards */}
      <div className="relative mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {riskData.map((item) => {
          const Icon = item.icon;
          const percentage =
            total > 0 ? Math.round((item.value / total) * 100) : 0;

          return (
            <div
              key={item.name}
              className={`group rounded-2xl border ${item.borderColor}
                ${item.bgColor} p-4
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-white/[0.045]`}
            >
              {/* Icon and label */}
              <div className="mb-3 flex items-center gap-2">
                <Icon className={`h-5 w-5 shrink-0 ${item.iconColor}`} />

                <span className="text-sm font-semibold text-gray-200">
                  {item.name}
                </span>
              </div>

              {/* Value */}
              <div className={`mb-3 text-2xl font-bold ${item.textColor}`}>
                {item.value}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              {/* Percentage */}
              <div className="mt-2 text-xs font-medium text-gray-400">
                {percentage}% of total
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Inventory summary
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium sm:text-sm">
          {riskData[0].value > 0 && (
            <span className="text-emerald-300">
              {riskData[0].value} safe
            </span>
          )}

          {riskData[1].value > 0 && (
            <span className="text-amber-300">
              {riskData[1].value} expiring soon
            </span>
          )}

          {riskData[2].value > 0 && (
            <span className="text-rose-300">
              {riskData[2].value} need attention
            </span>
          )}

          {total === 0 && (
            <span className="text-gray-400">
              No medicines tracked yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskChart;
