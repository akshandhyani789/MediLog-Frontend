
import React from "react";
import { Search, MapPin, LocateFixed, X } from "lucide-react";

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#090e0d] px-3 text-xs font-medium text-slate-200 outline-none transition focus:border-teal-500";

const labelClass =
  "mb-2 block text-[11px] font-semibold text-slate-400";

export default function MedicineSearchBar({
  filters,
  searchValue,
  hasViewerLocation,
  onSearchValueChange,
  onFilterChange,
  onSearch,
  onClearSearch,
  onReset,
  onLocationChange,
}) {
  const update = (key, value) => onFilterChange?.(key, value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        onLocationChange?.({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      () => alert("Location access denied. Please allow location or enter a locality.")
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#111817] to-[#0b100f] p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[2.2fr_0.95fr_1.7fr_auto]">
        <label className="min-w-0">
          <span className={labelClass}>Medicine or brand</span>
          <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.09] bg-[#090e0d] px-3 transition focus-within:border-teal-500">
            <Search size={18} className="shrink-0 text-slate-500" />
            <input
              value={searchValue}
              onChange={(e) => onSearchValueChange?.(e.target.value)}
              placeholder="Search medicine"
              className="w-full min-w-0 bg-transparent text-xs font-medium text-slate-200 outline-none placeholder:text-slate-600"
            />
            {searchValue && (
              <button
                type="button"
                onClick={onClearSearch}
                aria-label="Clear medicine search"
                className="shrink-0 text-slate-500 transition hover:text-slate-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </label>

        <label className="min-w-0">
          <span className={labelClass}>Strength</span>
          <select
            value={filters.strength}
            onChange={(e) => update("strength", e.target.value)}
            className={inputClass}
          >
            <option value="">Any strength</option>
            <option>250 mg</option>
            <option>500 mg</option>
            <option>650 mg</option>
            <option>1000 mg</option>
          </select>
        </label>

        <label className="min-w-0">
          <span className={labelClass}>Location</span>
          <div className="flex h-11 items-center gap-3 rounded-xl border border-white/[0.09] bg-[#090e0d] px-3 focus-within:border-teal-500">
            <MapPin size={18} className="shrink-0 text-slate-500" />
            <input
              value={filters.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City or area"
              className="w-full min-w-0 bg-transparent text-xs font-medium text-slate-200 outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <button
          type="submit"
          className="flex h-11 items-center justify-center gap-2 self-end rounded-xl bg-teal-500 px-5 text-sm font-bold text-[#061313] transition hover:bg-teal-400 active:scale-[0.98]"
        >
          <Search size={18} />
          Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.08] pt-4">
        <label className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Quantity</span>
          <select
            value={filters.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className="h-9 rounded-xl border border-white/[0.09] bg-[#090e0d] px-2 text-[11px] text-slate-300 outline-none focus:border-teal-500"
          >
            <option value="">Any quantity</option>
            <option value="1">1+</option>
            <option value="5">5+</option>
            <option value="10">10+</option>
            <option value="20">20+</option>
            <option value="50">50+</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Expiry after</span>
          <input
            type="date"
            value={filters.expiryAfter}
            onChange={(e) => update("expiryAfter", e.target.value)}
            className="h-9 w-[145px] rounded-xl border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-teal-600 [color-scheme:light]"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Distance</span>
          <select
            value={filters.distance}
            onChange={(e) => update("distance", e.target.value)}
            className="h-9 rounded-xl border border-white/[0.09] bg-[#090e0d] px-2 text-[11px] text-slate-300 outline-none focus:border-teal-500"
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
            <option value="100">Within 100 km</option>
            <option value="all">Any distance</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Sort by</span>
          <select
            value={filters.sortBy}
            onChange={(e) => update("sortBy", e.target.value)}
            className="h-9 rounded-xl border border-white/[0.09] bg-[#090e0d] px-2 text-[11px] text-slate-300 outline-none focus:border-teal-500"
          >
            <option value="relevance">Best relevance</option>
            <option value="distance">Nearest first</option>
            <option value="expiry">Expiry date</option>
            <option value="quantity">Highest quantity</option>
          </select>
        </label>

        <button
          type="button"
          onClick={useMyLocation}
          className="ml-auto flex items-center gap-2 text-[11px] font-medium text-teal-400 transition hover:text-teal-300"
        >
          <LocateFixed size={15} />
          {hasViewerLocation ? "Location enabled" : "Use my location"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-medium text-slate-400 transition hover:text-teal-300"
        >
          Reset filters
        </button>
      </div>
      {filters.distance !== "all" && !hasViewerLocation && (
        <p className="mt-3 text-[10px] text-amber-300">
          Use your location to filter bundles by distance.
        </p>
      )}
    </form>
  );
}
