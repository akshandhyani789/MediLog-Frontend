import React from "react";
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
    <div className="rounded-2xl p-5 bg-white  shadow-sm">

      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Inventory Status</h2>
      </div>

      <div className="space-y-2">
        {processed.slice(0, 6).map((med, i) => (
          <MedicineRow key={i} {...med} />
        ))}
      </div>

    </div>
  );
}

export default InventoryMedicineCard;