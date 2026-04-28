import React, { useEffect, useState } from "react";
import { Bell, Clock, Package, TrendingDown } from "lucide-react";

import GreetingCard from "../componant/dashboardComponants/GreetingCard";
import StatCard from "../componant/dashboardComponants/StatCard";
import InventoryMedicineCard from "../componant/dashboardComponants/InventoryMedicineCard";
import CompositionChart from "../componant/dashboardComponants/CompositionChart";
import InventoryBars from "../componant/dashboardComponants/InventoryBars";

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
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6  min-h-screen">
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading medicines: {error}
        </div>
      )}

      {/* Greeting */}
      <GreetingCard />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="TOTAL MEDICINES"
          value={totalMedicines}
          subtitle="in inventory"
          icon={Package}
        />

        <StatCard
          title="ACTIVE ALERTS"
          value={activeAlerts}
          subtitle="need attention"
          icon={Bell}
          valueColor="text-red-600"
        />

        <StatCard
          title="LOW STOCK"
          value={lowStock}
          subtitle="check inventory"
          icon={TrendingDown}
        />

        <StatCard
          title="EXPIRING SOON"
          value={expiringSoon}
          subtitle="within 30 days"
          icon={Clock}
          bgColor="bg-teal-900"
          valueColor="text-white"
          textColor="text-white"
          iconColor="text-white"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[320px]">
          <InventoryBars medicines={medicines} />
        </div>

        <div className="h-[320px]">
          <CompositionChart medicines={medicines} />
        </div>
      </div>

      {/* Inventory */}
      <InventoryMedicineCard medicines={medicines} />
    </div>
  );
}

export default DashboardSection;