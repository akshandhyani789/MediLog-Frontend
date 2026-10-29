import React from "react";

export default function StatusBadge({ status }) {
  const styles = {
    Safe: "bg-[#DCFCE7] text-[#15803D]",
    "Expiring Soon": "bg-[#FEF3C7] text-[#B45309]",
    Expired: "bg-[#FEE2E2] text-[#DC2626]",
    "Low Stock": "bg-[#DBEAFE] text-[#1D4ED8]",
    "Out of Stock": "bg-[#FEE2E2] text-[#DC2626]",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}