import React from "react";

function MedicineRow({ name, type, qty, total, expiry, days }) {

  const percent = total ? (qty / total) * 100 : 0;

  const getColor = () => {
    if (qty === 0) return "bg-red-500";
    if (days !== undefined && days <= 7) return "bg-yellow-500";
    if (percent < 30) return "bg-orange-400";
    return "bg-teal-600";
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-3 rounded-xl hover:bg-gray-50">

      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-400">{type}</p>
      </div>

      <div>
        <p className="text-sm">{qty}/{total}</p>
        <div className="w-full h-1 bg-gray-200 rounded">
          <div className={`h-1 rounded ${getColor()}`} style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div>
        <p className="text-sm">{expiry}</p>
        <p className="text-xs text-gray-400">{days}d</p>
      </div>

    </div>
  );
}

export default MedicineRow;