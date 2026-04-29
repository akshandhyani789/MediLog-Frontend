import React from "react";
import { Package, ChevronRight } from "lucide-react";
import MedicineRow from "./MedicineRow";

function InventoryMedicineCard({ medicines = [] }) {

  const processed = medicines.map((med) => {
    if (!med.expiryDate) {
      return {
        name: med.name,
        type: med.category || "Tablet",
        qty: med.stock || 0,
        total: med.stock + 5,
        expiry: "No date",
        days: 999,
      };
    }

    const expiry = new Date(med.expiryDate);
    const now = new Date();
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    return {
      name: med.name,
      type: med.category || "Tablet",
      qty: med.stock || 0,
      total: med.stock + 5,
      expiry: expiry.toLocaleDateString(),
      days,
    };
  });

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100">
            <Package className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Inventory Status</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Latest medicines in stock</p>
          </div>
        </div>
        <a href="#" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>
      </div>

      {/* Medicines List */}
      <div className="space-y-2.5">
        {processed.slice(0, 6).map((med, i) => (
          <MedicineRow key={i} {...med} />
        ))}
      </div>

      {/* Footer */}
      {processed.length > 6 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a href="#" className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors inline-flex items-center gap-1">
            View all medicines
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Empty State */}
      {processed.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No medicines yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first medicine to get started</p>
        </div>
      )}
    </div>
  );
}

export default InventoryMedicineCard;