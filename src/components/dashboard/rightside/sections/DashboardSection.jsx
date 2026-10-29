
import React, { useEffect, useState } from "react";
import {
  Clock,
  Package,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

import GreetingCard from "../componant/dashboardComponants/GreetingCard";
import StatCard from "../componant/dashboardComponants/StatCard";
import InventoryMedicineCard from "../componant/dashboardComponants/InventoryMedicineCard";
import CompositionChart from "../componant/dashboardComponants/CompositionChart";
import RiskChart from "../componant/dashboardComponants/RiskChart";

import { useAuth } from "../../../../hooks/useAuth";
import { getUserMedicines } from "../../../../services/api";
import { useAlertsData } from "../../../../hooks/useAlertData";
import { useAlerts } from "../../../../hooks/useAlerts";

function DashboardSection({ setActivePage, refetchTrigger = 0 }) {
  const { user } = useAuth();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alertsData = useAlertsData(user);
  const { alertCounts } = useAlerts(alertsData);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

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

  const lowStock = medicines.filter(
    (med) => med.stock < 5
  ).length;

  const expiringSoon = medicines.filter((med) => {
    if (!med.expiryDate) return false;

    const diff =
      (new Date(med.expiryDate) - new Date()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 && diff <= 30;
  }).length;

  // Dark glass loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#080B0B] px-3 py-4 sm:p-8">
        <div className="rounded-2xl border border-white/[0.08] bg-[#101818]/80 p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00C2C7]/20 bg-[#00C2C7]/[0.08]">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#00C2C7]/20 border-t-[#00C2C7]" />
          </div>

          <p className="text-sm font-medium text-gray-200">
            Loading dashboard...
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Preparing your medicine overview
          </p>
        </div>
      </div>
    );
  }

  return (
<div className="app-page-background relative isolate min-h-screen space-y-8 overflow-hidden p-4 text-slate-900 sm:p-6 lg:p-8">

  {/* Ambient teal glow */}
  <div className="pointer-events-none absolute left-[-100px] top-0 -z-0 h-80 w-80 rounded-full bg-[#00C2C7]/10 blur-[120px]" />
  <div className="pointer-events-none absolute bottom-20 right-[-100px] -z-0 h-96 w-96 rounded-full bg-teal-500/[0.06] blur-[140px]" />

  {/* Error Message */}
  {error && (
    <div className="relative z-10 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-950/30 p-4 shadow-lg backdrop-blur-2xl sm:p-5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <div>
        <h3 className="font-semibold text-red-300">
          Error loading medicines
        </h3>
        <p className="mt-1 text-sm text-red-200/70">{error}</p>
      </div>
    </div>
  )}

  {/* Greeting Glass Card */}
  <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00C2C7]/30 hover:bg-white/[0.05]">
    <GreetingCard />
  </div>

  {/* KPI Stats */}
  <section className="relative z-10">
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
        Key Metrics
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
      <StatCard
        title="Total Medicines"
        value={totalMedicines}
        subtitle="in your inventory"
        icon={Package}
        valueColor="text-[#00C2C7]"
      />

      <StatCard
        title="Active Alerts"
        value={alertCounts.active}
        subtitle="require attention"
        icon={AlertTriangle}
        valueColor="text-red-600"
      />

      <StatCard
        title="Low Stock"
        value={lowStock}
        subtitle="medicines to reorder"
        icon={TrendingDown}
        valueColor="text-blue-700"
      />

      <StatCard
        title="Expiring Soon"
        value={expiringSoon}
        subtitle="within 30 days"
        icon={Clock}
        valueColor="text-amber-700"
      />
    </div>
  </section>

  {/* Analytics */}
  <section className="relative z-10">
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
        Analytics
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00C2C7]/30 hover:bg-white/[0.045] sm:p-4 lg:col-span-2">
        <RiskChart medicines={medicines} />
      </div>

      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00C2C7]/30 hover:bg-white/[0.045] sm:p-4">
        <CompositionChart medicines={medicines} />
      </div>
    </div>
  </section>

  {/* Inventory */}
  <section className="relative z-10">
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
        Inventory
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 hover:border-[#00C2C7]/30 hover:bg-white/[0.045] sm:p-4">
      <InventoryMedicineCard
        medicines={medicines}
        handlePageChange={handlePageChange}
      />
    </div>
  </section>
</div>

  );
}

export default DashboardSection;