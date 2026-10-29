
import React, { useState, useEffect, useCallback, useRef } from "react";
import MedicineTable from "../componant/userMedicineComponant/MedicineTable";
import { useAuth } from "../../../../hooks/useAuth";
import { getUserMedicines } from "../../../../services/api";
import { Search, Filter, Package } from "lucide-react";

function UserMedicineSection({ refetchTrigger = 0 }) {
  const { user } = useAuth();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchMedicines = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    if (!user) {
      setMedicines([]);
      setError("Sign in to view your medicine inventory.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getUserMedicines(user);
      if (!Array.isArray(data)) {
        throw new Error("The medicine service returned an invalid response.");
      }
      if (requestId.current === currentRequestId) setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      if (requestId.current === currentRequestId) {
        setMedicines([]);
        setError(error.message || "Unable to load your medicine inventory.");
      }
    } finally {
      if (requestId.current === currentRequestId) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMedicines();
    return () => {
      requestId.current += 1;
    };
  }, [user, refetchTrigger, fetchMedicines]);

  /* ============================================================
     TRANSFORM DATA AND CALCULATE STATUS
     ============================================================ */

  const medicine = medicines.map((med) => {
    const expiry = new Date(med.expiryDate);
    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const expiryDay = new Date(
      expiry.getFullYear(),
      expiry.getMonth(),
      expiry.getDate()
    );

    const diffDays = Math.ceil(
      (expiryDay - today) / (1000 * 60 * 60 * 24)
    );

    let status = "Safe";

    if (Number.isNaN(expiry.getTime())) {
      status = "Unknown";
    } else if (diffDays <= 0) {
      status = "Expired";
    } else if (Number(med.stock) <= 0) {
      status = "Out of Stock";
    } else if (diffDays <= 30) {
      status = "Expiring Soon";
    }

    return {
      _id: med._id,
      name: med.name || "Unknown",
      brand: med.brand || "",
      expiryDate: med.expiryDate,
      stock: Number(med.stock) || 0,
      daysLeft: diffDays,
      category: med.category || "Tablet",
      status,
    };
  });

  /* ============================================================
     SEARCH AND FILTER LOGIC
     ============================================================ */

  const filteredMedicine = medicine.filter((med) => {
    const query = searchTerm.toLowerCase();

    return (
      (searchTerm === "" ||
        med.name.toLowerCase().includes(query) ||
        med.brand.toLowerCase().includes(query)) &&
      (categoryFilter === "All Categories" ||
        med.category === categoryFilter) &&
      (statusFilter === "All Status" || med.status === statusFilter)
    );
  });

  const hasActiveFilters =
    searchTerm !== "" ||
    categoryFilter !== "All Categories" ||
    statusFilter !== "All Status";

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10";

  const labelClass =
    "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <div className="app-page-background min-h-screen space-y-6 p-4 text-slate-900 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#00C2C7]/20 bg-[#00C2C7]/[0.08] text-[#00C2C7] shadow-[0_0_24px_rgba(0,194,199,0.05)]">
            <Package className="h-6 w-6" />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C2C7] shadow-[0_0_8px_rgba(0,194,199,0.8)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C2C7]">
                Inventory Management
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              My Medicines
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Manage your inventory and monitor expiry dates.
            </p>
          </div>
        </div>

        {/* Inventory count */}
        <div className="flex items-center gap-3 self-start rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 sm:self-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00C2C7]/[0.08] text-[#00C2C7]">
            <Package className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Total medicines
            </p>
            <p className="text-lg font-semibold tabular-nums text-white">
              {medicine.length}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-2xl sm:rounded-3xl sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-[#00C2C7]/[0.035] blur-3xl" />

        <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-[#00C2C7]">
              <Filter className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-100">
                Search & Filters
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Find medicines in your inventory.
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2 text-xs font-medium text-[#00C2C7] transition hover:bg-[#00C2C7]/[0.08]"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="relative flex flex-col gap-4">
          {/* SEARCH */}
          <div>
            <label className={labelClass} htmlFor="medicine-search">
              Search medicines
            </label>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

              <input
                id="medicine-search"
                type="text"
                placeholder="Search by medicine name or brand..."
                className={`${inputClass} pl-10`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY AND STATUS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="medicine-category-filter">
                Category
              </label>

              <select
                id="medicine-category-filter"
                value={categoryFilter}
                className={inputClass}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                <option>Tablet</option>
                <option>Capsule</option>
                <option>Syrup</option>
                <option>Injection</option>
                <option>Sachet</option>
                <option>Drops</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="medicine-status-filter">
                Medicine Status
              </label>

              <select
                id="medicine-status-filter"
                value={statusFilter}
                className={inputClass}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Safe</option>
                <option>Expiring Soon</option>
                <option>Expired</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* FILTER RESULTS */}
        {hasActiveFilters && (
          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-4">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-200">
                {filteredMedicine.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-200">
                {medicine.length}
              </span>{" "}
              medicines
            </p>

            <div className="rounded-lg border border-[#00C2C7]/15 bg-[#00C2C7]/[0.06] px-2.5 py-1 text-[10px] font-medium text-[#63DADD]">
              Filters applied
            </div>
          </div>
        )}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#00C2C7]" />
          <p className="mt-4 text-sm font-medium text-gray-300">
            Loading medicines...
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Preparing your inventory.
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300"
        >
          {error}
          <button
            type="button"
            onClick={fetchMedicines}
            className="ml-3 font-semibold text-red-200 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* MEDICINE TABLE */}
      {!loading && !error && (
        <>
          {filteredMedicine.length > 0 ? (
            <div className="min-w-0">
              <MedicineTable
                filteredMedicine={filteredMedicine}
                fetchMedicines={fetchMedicines}
                setMedicines={setMedicines}
              />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-12 text-center sm:rounded-3xl">
              <div className="pointer-events-none absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-[#00C2C7]/[0.04] blur-3xl" />

              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00C2C7]/15 bg-[#00C2C7]/[0.06] text-[#00C2C7]">
                <Package className="h-7 w-7" />
              </div>

              <h3 className="relative text-base font-semibold text-gray-100">
                No medicines found
              </h3>

              <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                {hasActiveFilters
                  ? "No medicines match your current search or filters. Try adjusting them."
                  : "No medicines added yet. Add your first medicine to get started."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="relative mt-5 rounded-xl bg-[#00C2C7] px-4 py-2.5 text-sm font-semibold text-[#061112] transition hover:bg-[#28D5D8]"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserMedicineSection;