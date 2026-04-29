import React, { useEffect, useState } from "react";
import { Bell, Clock, Package, TrendingDown, AlertTriangle } from "lucide-react";

import GreetingCard from "../componant/dashboardComponants/GreetingCard";
import StatCard from "../componant/dashboardComponants/StatCard";
import InventoryMedicineCard from "../componant/dashboardComponants/InventoryMedicineCard";
import CompositionChart from "../componant/dashboardComponants/CompositionChart";
import RiskChart from "../componant/dashboardComponants/RiskChart";
import { useAuth } from "../../../../context/AuthContext";
import { getUserMedicines } from "../../../../services/api";

function DashboardSection({ refetchTrigger = 0 }) {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setMedicines([]);
          setLoading(false);
          return;
        }

        const data = await getUserMedicines(user);
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError(err.message);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, refetchTrigger]);

  const totalMedicines = medicines.length;

  const activeAlerts = medicines.filter(
    (med) =>
      med.stock < 5 ||
      (med.expiryDate && new Date(med.expiryDate) < new Date())
  ).length;

  const lowStock = medicines.filter((med) => med.stock < 5).length;

  const expiringSoon = medicines.filter((med) => {
    if (!med.expiryDate) return false;

    const expiry = new Date(med.expiryDate);
    const now = new Date();
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);

    return diffDays > 0 && diffDays <= 30;
  }).length;

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-3">
            <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error loading medicines</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Greeting Section */}
      <GreetingCard />

      {/* KPI Stats Grid */}
      <div>
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest letter-spacing-1">Key Metrics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Medicines"
            value={totalMedicines}
            subtitle="in your inventory"
            icon={Package}
            valueColor="text-teal-600"
          />

          <StatCard
            title="Active Alerts"
            value={activeAlerts}
            subtitle="require attention"
            icon={AlertTriangle}
            valueColor="text-red-600"
          />

          <StatCard
            title="Low Stock"
            value={lowStock}
            subtitle="medicines to reorder"
            icon={TrendingDown}
            valueColor="text-orange-600"
          />

          <StatCard
            title="Expiring Soon"
            value={expiringSoon}
            subtitle="within 30 days"
            icon={Clock}
            valueColor="text-amber-600"
          />
        </div>
      </div>

      {/* Analytics Section */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest letter-spacing-1">Analytics</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RiskChart medicines={medicines} />
          </div>

          <div>
            <CompositionChart medicines={medicines} />
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest letter-spacing-1">Inventory</p>
        </div>
        <InventoryMedicineCard medicines={medicines} />
      </div>
    </div>
  );
}

export default DashboardSection;