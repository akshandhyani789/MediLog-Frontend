import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const COLORS = ["#0F766E", "#3B82F6", "#8B5CF6", "#14B8A6", "#06B6D4", "#6366F1"];

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-300 flex flex-col">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Medicine Composition
          </h2>
        </div>
        <p className="text-sm text-gray-500 font-medium">
          Breakdown by category
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col items-center gap-8 flex-1">

        {/* 📊 CHART */}
        <div className="relative w-full sm:w-3/4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-400 font-semibold">TYPES</span>
            <span className="text-3xl font-bold text-gray-900">
              {data.length}
            </span>
          </div>
        </div>

        {/* 📋 LEGEND */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 group"
            >
              {/* Color Dot */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-gray-700 font-medium truncate">
                  {item.name}
                </span>
              </div>

              {/* Count */}
              <span className="font-bold text-gray-900 text-sm flex-shrink-0">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompositionChart;