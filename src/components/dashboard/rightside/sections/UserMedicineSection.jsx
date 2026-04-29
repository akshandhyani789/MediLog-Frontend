import React, { useState, useEffect, useCallback } from "react";
import MedicineTable from "../componant/userMedicineComponant/MedicineTable";
import { useAuth } from "../../../../context/AuthContext";
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
    <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">

      {/* 🔥 HEADER */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              My Medicines
            </h1>
            <p className="text-gray-600 font-medium mt-1">
              Manage your inventory, stock & expiry alerts
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 FILTER CARD */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:border-gray-300 transition-all duration-300">
        
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-600" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Filters
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          
          {/* 🔍 SEARCH */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <select
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-300 cursor-pointer"
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

          {/* STATUS */}
          <select
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:border-gray-300 cursor-pointer"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Safe</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {/* FILTER INFO */}
        {(searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status") && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 font-medium">
              Showing {filteredMedicine.length} of {medicine.length} medicines
            </p>
          </div>
        )}
      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-3">
            <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading medicines...</p>
        </div>
      )}

      {/* 📋 TABLE */}
      {!loading && (
        <>
          {filteredMedicine.length > 0 ? (
            <MedicineTable
              filteredMedicine={filteredMedicine}
              fetchMedicines={fetchMedicines}   // ✅ FIX
              setMedicines={setMedicines}       // ⚡ INSTANT UI
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-gray-200 border-dashed">
              <Package className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                No medicines found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status"
                  ? "Try adjusting your filters"
                  : "Add your first medicine to get started"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserMedicineSection;