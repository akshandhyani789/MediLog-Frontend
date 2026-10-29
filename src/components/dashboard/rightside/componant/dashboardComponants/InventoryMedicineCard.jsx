
import React from "react";
import { Package, ChevronRight } from "lucide-react";
import MedicineRow from "./MedicineRow";

function InventoryMedicineCard({ medicines = [], handlePageChange }) {
  const processed = medicines.map((med) => {
    const stock = med.stock || 0;

    if (!med.expiryDate) {
      return {
        name: med.name,
        type: med.category || "Tablet",
        qty: stock,
        total: stock + 5,
        expiry: "No date",
        days: 999,
      };
    }

    const expiry = new Date(med.expiryDate);
    const now = new Date();
    const days = Math.ceil(
      (expiry - now) / (1000 * 60 * 60 * 24)
    );

    return {
      name: med.name,
      type: med.category || "Tablet",
      qty: stock,
      total: stock + 5,
      expiry: expiry.toLocaleDateString(),
      days,
    };
  });

  const navigateToMedicines = () => {
    handlePageChange?.("MyMedicines");
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00C2C7]/25 sm:p-8">
      {/* Subtle teal ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#00C2C7]/[0.06] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-xl border border-[#00C2C7]/20 bg-[#00C2C7]/[0.09] p-2.5">
            <Package className="h-5 w-5 text-[#00C2C7]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-100 sm:text-xl">
              Inventory Status
            </h2>
            <p className="mt-0.5 text-xs font-medium text-gray-400">
              Latest medicines in stock
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={navigateToMedicines}
          aria-label="View all medicines"
          className="shrink-0 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2 text-gray-400 transition-all duration-200 hover:border-[#00C2C7]/30 hover:bg-[#00C2C7]/10 hover:text-[#00C2C7]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Medicines List */}
      <div className="relative space-y-2.5">
        {processed.slice(0, 6).map((med, i) => (
          <MedicineRow key={i} {...med} />
        ))}
      </div>

      {/* Footer */}
      {processed.length > 6 && (
        <div className="relative mt-4 border-t border-white/[0.08] pt-4">
          <button
            type="button"
            onClick={navigateToMedicines}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00C2C7] transition-colors hover:text-teal-300"
          >
            View all medicines
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {processed.length === 0 && (
        <div className="relative py-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <Package className="h-8 w-8 text-gray-500" />
          </div>

          <p className="font-medium text-gray-200">
            No medicines yet
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Add your first medicine to get started
          </p>
        </div>
      )}
    </div>
  );
}

export default InventoryMedicineCard;