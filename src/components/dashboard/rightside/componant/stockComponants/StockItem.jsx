import React, { useState } from "react";
import { Minus, Plus, Pill } from "lucide-react";
import { useAuth } from "../../../../../hooks/useAuth";
import { updateMedicineStock } from "../../../../../services/api";

function StockItem({ medicine, updateStock }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { _id, name, brand, dosage, stock } = medicine;

  const isOut = stock === 0;
  const isLow = stock > 0 && stock < 10;

  const status = isOut ? "Out of Stock" : isLow ? "Low Stock" : "Healthy";

  const statusClass = isOut
    ? "bg-red-50 text-red-600"
    : isLow
    ? "bg-amber-50 text-amber-700"
    : "bg-green-50 text-green-700";

  const handleStockChange = async (change) => {
    try {
      setIsLoading(true);
      const newStock = (stock || 0) + change;

      if (newStock < 0) {
        alert("Stock cannot be below 0");
        return;
      }

      const response = await updateMedicineStock(user, _id, change);
      updateStock(_id, change);
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("Failed to update stock. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
          <Pill className="w-5 h-5 text-teal-700" />
        </div>

        <div>
          <h3 className="font-bold text-gray-950">{name}</h3>
          <p className="text-sm text-gray-500">
            {brand || "No brand"} {dosage ? `• ${dosage}` : ""}
          </p>

          <span
            className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase font-bold">Current</p>
          <p className="text-2xl font-bold text-gray-950">{stock}</p>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
          <button
            onClick={() => handleStockChange(-1)}
            disabled={stock <= 0 || isLoading}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleStockChange(1)}
            disabled={isLoading}
            className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockItem;