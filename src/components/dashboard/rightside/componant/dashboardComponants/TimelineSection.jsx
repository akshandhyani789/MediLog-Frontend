import React from "react";
import MedicineItem from "./MedicineItem";

function TimelineSection({ title, items = [], tone, icon }) {
  return (
    <div className="space-y-3">

      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-gray-400">All clear</p>
      ) : (
        items.map((item, i) => (
          <MedicineItem key={i} {...item} tone={tone} />
        ))
      )}
    </div>
  );
}

export default TimelineSection;