import React, { useState, useEffect, useCallback } from "react";
import MedicineTable from "../componant/userMedicineComponant/MedicineTable";
import { useAuth } from "../../../../hooks/useAuth";
import { getUserMedicines } from "../../../../services/api";
import { Search, Filter, Package } from "lucide-react";

function UserMedicineSection({ refetchTrigger = 0 }) {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH FUNCTION
  const fetchMedicines = useCallback(async () => {
    if (!user) {
      setMedicines([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserMedicines(user);
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ✅ FETCH ON LOAD / TRIGGER
  useEffect(() => {
    fetchMedicines();
  }, [user, refetchTrigger, fetchMedicines]);

  // 🔥 TRANSFORM DATA
  const medicine = medicines.map((med) => {
    const expiry = new Date(med.expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    let status = "Safe";

    if (diffDays <= 0) status = "Expired";
    else if (med.stock === 0) status = "Out of Stock";
    else if (diffDays <= 30) status = "Expiring Soon";

    return {
      _id: med._id,
      name: med.name || "Unknown",
      brand: med.brand || "",
      expiryDate: med.expiryDate,
      stock: med.stock || 0,
      daysLeft: diffDays,
      category: med.category || "Tablet",
      status,
    };
  });

  // 🔍 FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // 🔍 FILTER LOGIC
  const filteredMedicine = medicine.filter((med) => {
    return (
      (searchTerm === "" ||
        med.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "All Categories" ||
        med.category === categoryFilter) &&
      (statusFilter === "All Status" || med.status === statusFilter)
    );
  });

  return (
  <div className="p-4 sm:p-6 space-y-6 min-h-screen">

    {/* 🔥 HEADER */}
    <div className="flex items-start sm:items-center gap-3">
      <Package className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600 mt-1 sm:mt-0" />
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
          My Medicines
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your inventory & expiry alerts
        </p>
      </div>
    </div>

    {/* 🔥 FILTER CARD */}
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm">

      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-600" />
        <p className="text-xs font-bold text-gray-500 uppercase">
          Filters
        </p>
      </div>

      {/* 🔥 MOBILE STACK */}
      <div className="flex flex-col gap-3">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DROPDOWNS (STACK ON MOBILE, INLINE ON DESKTOP) */}
        <div className="flex flex-col sm:flex-row gap-3">

          <select
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500"
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

          <select
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500"
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

      {/* FILTER INFO */}
      {(searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status") && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Showing {filteredMedicine.length} of {medicine.length}
          </p>
        </div>
      )}
    </div>

    {/* ⏳ LOADING */}
    {loading && (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <p className="text-gray-600 mt-2 text-sm">Loading...</p>
      </div>
    )}

    {/* 📋 TABLE / MOBILE SCROLL */}
    {!loading && (
      <>
        {filteredMedicine.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-2xl sm:rounded-3xl border border-gray-200">
            <MedicineTable
              filteredMedicine={filteredMedicine}
              fetchMedicines={fetchMedicines}
              setMedicines={setMedicines}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-dashed">
            <Package className="w-10 h-10 text-gray-300 mb-2" />
            <h3 className="text-base font-semibold text-gray-900">
              No medicines found
            </h3>
            <p className="text-xs text-gray-500 mt-1 text-center px-4">
              {searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status"
                ? "Try changing filters"
                : "Add your first medicine"}
            </p>
          </div>
        )}
      </>
    )}
  </div>
);
}

export default UserMedicineSection;