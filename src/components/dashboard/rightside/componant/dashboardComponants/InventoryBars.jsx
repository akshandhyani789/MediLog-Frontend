import React, { useMemo } from "react";

function InventoryBars({ medicines = [] }) {

  // 🔥 Group medicines by month
  const monthlyData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const counts = new Array(12).fill(0);

    medicines.forEach((med) => {
      if (!med.createdAt) return;

      const date = new Date(med.createdAt);
      const monthIndex = date.getMonth();

      counts[monthIndex] += 1;
    });

    return months.map((month, i) => ({
      month,
      value: counts[i],
    }));
  }, [medicines]);

  // 🔥 Find max for scaling
  const maxValue = Math.max(...monthlyData.map(d => d.value), 1);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Medicine Activity
        </h2>
        <p className="text-sm text-gray-500">
          Monthly added medicines
        </p>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-[220px] gap-3">
        {monthlyData.map((item, i) => {
          const height = (item.value / maxValue) * 100;

          return (
            <div key={i} className="flex flex-col items-center flex-1 group">
              
              {/* Bar */}
              <div className="w-full flex justify-center">
                <div
                  className="w-3 sm:w-4 rounded-full bg-gradient-to-t from-teal-700 to-teal-400 
                  transition-all duration-500 group-hover:scale-110"
                  style={{ height: `${height}%`, minHeight: item.value ? "10px" : "4px" }}
                />
              </div>

              {/* Value */}
              <span className="text-[10px] text-gray-400 mt-1">
                {item.value}
              </span>

              {/* Month */}
              <span className="text-[10px] mt-2 text-gray-500 tracking-wide">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {medicines.length === 0 && (
        <div className="text-center text-gray-400 text-sm mt-10">
          No data to display
        </div>
      )}
    </div>
  );
}

export default InventoryBars;