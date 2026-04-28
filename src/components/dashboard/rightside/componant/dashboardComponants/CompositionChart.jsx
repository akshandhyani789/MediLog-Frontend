import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0F766E", "#6B7280", "#1F2937", "#14B8A6"];

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
    <div className="bg-white rounded-3xl p-6 shadow-sm  flex flex-col">
      
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Composition
      </h2>

      {/* 📊 Chart */}
      <div className="relative w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-400">TYPES</span>
          <span className="text-lg font-semibold text-gray-800">
            {data.length}
          </span>
        </div>
      </div>

      {/* 📋 Legend (NO SCROLL) */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-start text-sm">
            
            {/* LEFT */}
            <div className="flex gap-2 items-start flex-1 min-w-0">
              
              <span
                className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                style={{ background: item.color }}
              />

              {/* 🔥 WRAPPING TEXT INSTEAD OF TRUNCATE */}
              <span className="text-gray-700 break-words leading-tight">
                {item.name}
              </span>
            </div>

            {/* RIGHT */}
            <span className="font-semibold text-gray-800 flex-shrink-0 ml-2">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompositionChart;