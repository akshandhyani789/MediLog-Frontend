
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";

const COLORS = [
  "#0F857B",
  "#1D4ED8",
  "#15803D",
  "#12B8A6",
  "#15803D",
  "#0EA5A4",
];

const CompositionChart = ({ medicines = [] }) => {
  const data = useMemo(() => {
    const map = {};

    medicines.forEach((med) => {
      const type = med.category || "Other";
      map[type] = (map[type] || 0) + 1;
    });

    return Object.keys(map).map((key, i) => ({
      name: key,
      value: map[key],
      color: COLORS[i % COLORS.length],
    }));
  }, [medicines]);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-3xl
        border border-white/[0.09] bg-white/[0.035]
        p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        backdrop-blur-2xl transition-all duration-300
        hover:border-[#00C2C7]/25 sm:p-8"
    >
      {/* Ambient teal glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#00C2C7]/[0.06] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6">
        <div className="mb-1 flex items-center gap-2">
          <div className="rounded-lg border border-[#00C2C7]/20 bg-[#00C2C7]/[0.08] p-2">
            <TrendingUp className="h-5 w-5 text-[#00C2C7]" />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-gray-100 sm:text-xl">
            Medicine Composition
          </h2>
        </div>

        <p className="ml-1 mt-2 text-sm font-medium text-gray-400">
          Breakdown by category
        </p>
      </div>

      {/* Chart and legend */}
      <div className="relative flex flex-1 flex-col items-center gap-8">
        {/* Pie chart */}
        <div className="relative h-[220px] w-full sm:w-3/4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                stroke="rgba(255,255,255,0.95)"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  color: "#0F172A",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                }}
                itemStyle={{ color: "#0F766E" }}
                labelStyle={{ color: "#0F172A" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-[0.15em] text-gray-500">
              TYPES
            </span>
            <span className="mt-1 text-3xl font-bold text-gray-100">
              {data.length}
            </span>
          </div>
        </div>

        {/* Empty chart message */}
        {data.length === 0 && (
          <p className="-mt-5 text-center text-sm text-gray-500">
            Add medicines to see your category breakdown.
          </p>
        )}

        {/* Legend */}
        {data.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {data.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="group flex min-w-0 items-center gap-2 rounded-xl
                  border border-white/[0.06] bg-white/[0.025] p-2.5
                  transition-all duration-300
                  hover:border-[#00C2C7]/20 hover:bg-white/[0.045]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}40`,
                    }}
                  />

                  <span className="truncate text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-200">
                    {item.name}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-bold text-gray-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompositionChart;
