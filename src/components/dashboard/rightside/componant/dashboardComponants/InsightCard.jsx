```jsx
import React from "react";
import { Package, Sparkles } from "lucide-react";

function InsightCard({
  title = "Pantoprazole is completely out of stock",
  description = "You've run out of Pantoprazole 40mg. Head to the Stock page to reorder.",
}) {
  return (
    <div
      className="group relative flex gap-3 overflow-hidden rounded-xl
        border border-[#00C2C7]/20
        bg-white/[0.035] p-3
        shadow-[0_4px_20px_rgba(0,0,0,0.12)]
        backdrop-blur-xl
        transition-all duration-300
        hover:border-[#00C2C7]/40
        hover:bg-[#00C2C7]/[0.05]
        animate-glow"
    >
      {/* Subtle teal glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#00C2C7]/[0.08] blur-2xl" />

      {/* Icon */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#00C2C7]/20 bg-[#00C2C7]/[0.09]">
        <Package className="h-4 w-4 text-[#00C2C7]" />
      </div>

      {/* Content */}
      <div className="relative min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold leading-relaxed text-gray-100">
            {title}
          </span>

          <span
            className="inline-flex items-center gap-1 rounded-full
              border border-[#00C2C7]/20
              bg-[#00C2C7]/[0.09] px-2 py-0.5
              text-[10px] font-semibold tracking-wide text-[#00C2C7]"
          >
            <Sparkles className="h-3 w-3" />
            SMART INSIGHT
          </span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default InsightCard;
```