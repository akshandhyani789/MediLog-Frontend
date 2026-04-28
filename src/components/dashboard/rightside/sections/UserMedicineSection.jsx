import React, { useState, useEffect, useCallback } from "react";
import MedicineTable from "../componant/userMedicineComponant/MedicineTable";
import { useAuth } from "../../../../context/AuthContext";
import { getUserMedicines } from "../../../../services/api";

function UserMedicineSection({ refetchTrigger = 0 }) {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch on mount and when refetchTrigger changes
  useEffect(() => {
    fetchMedicines();
  }, [user, refetchTrigger, fetchMedicines]);

  // 🔥 Transform data
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

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

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
    <div className="space-y-6">
      {/* 🔥 Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Medicines</h1>
        <p className="text-sm text-gray-500">
          Manage your inventory, stock & expiry alerts
        </p>
      </div>

      {/* 🔥 Filters Card */}
      <div className="bg-white p-4 rounded-2xl shadow-sm  flex flex-col md:flex-row gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Search medicines..."
          className="w-full md:w-1/3 px-4 py-2 rounded-xl border bg-gray-50 text-sm focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-xl border bg-gray-50 text-sm"
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
          className="px-4 py-2 rounded-xl border bg-gray-50 text-sm"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Safe</option>
          <option>Expiring Soon</option>
          <option>Expired</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500">Loading medicines...</div>
      )}

      {/* Table */}
      {!loading && <MedicineTable filteredMedicine={filteredMedicine} />}
    </div>
  );
}

export default UserMedicineSection;