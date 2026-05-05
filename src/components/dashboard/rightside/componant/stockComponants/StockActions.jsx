import React from "react";
import { Plus, Minus, Info } from "lucide-react";

function StockActions({ onAddStock, onReduceStock }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
          Quick Control
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-950">
          Stock Actions
        </h2>

        <div className="mt-6 space-y-3">
          <button 
            onClick={onAddStock}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.01] transition"
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </button>

          <button 
            onClick={onReduceStock}
            className="w-full py-3 rounded-2xl bg-gray-50 text-gray-800 font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <Minus className="w-4 h-4" />
            Reduce Stock
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] p-5 bg-teal-50 text-teal-900">
        <div className="flex gap-3">
          <Info className="w-5 h-5 mt-0.5" />
          <p className="text-sm leading-6">
            Stock status updates automatically based on quantity. Medicines
            below 10 are marked as low stock.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockActions;