import React from "react";
import {
  Pill,
  Package,
  CalendarDays,
  MapPin,
  Eye,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function MedicineListingCard({
  bundle,
  onViewDetails,
}) {
  const items = Array.isArray(bundle.items) ? bundle.items : [];

  return (
    <article className="mb-3 min-w-0 rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#111817] to-[#0b100f] p-4 transition duration-200 hover:border-teal-900 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-teal-900/80 bg-teal-950/60 text-teal-400">
            <Pill size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold text-slate-200 sm:text-[15px]">
              {bundle.name || "Medicine bundle"}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
              <MapPin size={13} className="shrink-0" />
              {bundle.location || "Pickup location not specified"}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-teal-900 bg-teal-950/50 px-2.5 py-1.5 text-[9px] font-semibold text-teal-300">
          Community share
        </span>
      </div>

      {bundle.description && (
        <p className="mb-4 text-xs leading-5 text-slate-400">
          {bundle.description}
        </p>
      )}

      <div className="space-y-2 border-y border-white/[0.08] py-4">
        {items.map((item, index) => {
          const quantity = Number(item.quantity);
          const validQuantity = Number.isFinite(quantity) && quantity > 0;

          return (
            <div
              key={`${bundle.id}-${index}`}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200">
                  {item.name || "Medicine"}
                  {item.strength ? ` · ${item.strength}` : ""}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {item.brand || "Generic"} · {validQuantity ? quantity : "—"}{" "}
                  units
                </p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                  <CalendarDays size={12} />
                  Expires: {formatDate(item.expiryDate)}
                </p>
              </div>
              <p className="shrink-0 text-xs font-semibold text-teal-300">
                {validQuantity ? `${quantity} available` : "Availability unknown"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-teal-200">
            Non-commercial listing
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            No sale price or payment is supported.
          </p>
          <p className="mt-1 text-[9px] text-slate-600">
            Listed {formatDate(bundle.createdAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails?.(bundle)}
          className="flex min-h-9 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-3.5 text-[11px] font-semibold text-slate-200 transition hover:border-teal-800 hover:bg-teal-950/40"
        >
          <Eye size={14} />
          Listing details
        </button>
      </div>
    </article>
  );
}
