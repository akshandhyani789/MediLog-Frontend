import React from "react";
import { Package } from "lucide-react";

function InsightCard({
  title = "Pantoprazole is completely out of stock",
  description = "You've run out of Pantoprazole 40mg. Head to the Stock page to reorder.",
}) {
  return (
    <div className="flex gap-3 p-3 rounded-xl 
      bg-[#0F766E]/5 border border-[#0F766E]/20 
      hover:bg-[#0F766E]/10 transition
     animate-glow">

      {/* Icon */}
      <div className="bg-[#0F766E]/10 p-2 rounded-lg 
        animate-pulse">
        <Package className="w-4 h-4 text-[#0F766E]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-800">
            {title}
          </span>

          <span className="text-[10px] px-2 py-0.5 rounded-full 
            bg-[#134E4A] text-white font-semibold tracking-wide">
            SMART INSIGHT
          </span>
        </div>

        <p className="text-xs text-gray-600 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

export default InsightCard;