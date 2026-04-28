import React from "react";

function MedicineItem({ name, subtitle, days }) {

  return (
    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors min-h-[60px] sm:min-h-[70px]">

      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{name}</p>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
      </div>

      <span className={`ml-3 text-sm sm:text-base font-semibold whitespace-nowrap ${
        days <= 0 ? "text-red-500" :
        days <= 7 ? "text-yellow-500" :
        "text-green-600"
      }`}>
        {days <= 0 ? "Expired" : `${days}d`}
      </span>

    </div>
  );
}

export default MedicineItem;