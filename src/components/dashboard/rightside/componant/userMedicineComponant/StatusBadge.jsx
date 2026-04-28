import React from "react";

export default function StatusBadge({ status }) {
  const styles = {
    Safe: "bg-teal-100 text-teal-700",
    "Expiring Soon": "bg-yellow-100 text-yellow-700",
    Expired: "bg-red-100 text-red-600",
    "Out of Stock": "bg-gray-200 text-gray-600",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded ${styles[status]}`}>
      {status}
    </span>
  );
}