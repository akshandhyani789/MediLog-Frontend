import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import StockItem from "./StockItem";


function CriticalStockList({ medicines, updateStock }) {
  const critical = medicines.filter((med) => med.stock === 0 || med.stock < 10);

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-7 shadow-sm min-h-[260px]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Attention Needed
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">
            Critical Stock
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Medicines that require immediate stock action.
          </p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
      </div>

      {critical.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-3xl bg-gradient-to-br from-green-50 to-teal-50">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="mt-4 font-bold text-gray-900">
            All medicines are healthy
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No low stock or out-of-stock medicines found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {critical.map((med) => (
            <StockItem
              key={med._id}
              medicine={med}
              updateStock={updateStock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CriticalStockList;