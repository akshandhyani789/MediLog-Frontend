import React from "react";
import { Package, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

function StockOverviewCards({ medicines }) {
  const total = medicines.reduce((sum, med) => sum + Number(med.stock || 0), 0);
  const low = medicines.filter((med) => med.stock > 0 && med.stock < 10).length;
  const out = medicines.filter((med) => med.stock === 0).length;
  const healthy = medicines.filter((med) => med.stock >= 10).length;

  const cards = [
    {
      label: "Total Units",
      value: total,
      icon: Package,
      color: "text-teal-700",
      bg: "bg-teal-50",
    },
    {
      label: "Low Stock",
      value: low,
      icon: TrendingDown,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Out of Stock",
      value: out,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Healthy Stock",
      value: healthy,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Stock
              </span>
            </div>

            <h2 className={`mt-5 text-3xl font-bold ${card.color}`}>
              {card.value}
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              {card.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default StockOverviewCards;