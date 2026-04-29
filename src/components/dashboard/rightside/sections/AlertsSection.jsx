import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, Zap, ChevronRight } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { getUserMedicines } from "../../../../services/api";

function AlertsSection() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const data = await getUserMedicines(user);
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate alerts
  const now = new Date();
  const expiredMedicines = medicines.filter(
    (med) => med.expiryDate && new Date(med.expiryDate) < now
  );

  const expiringSoonMedicines = medicines.filter((med) => {
    if (!med.expiryDate) return false;
    const expiry = new Date(med.expiryDate);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 30;
  });

  const lowStockMedicines = medicines.filter((med) => med.stock > 0 && med.stock < 5);

  const outOfStockMedicines = medicines.filter((med) => med.stock === 0);

  const allAlerts = [
    ...expiredMedicines.map((med) => ({
      type: "expired",
      medicine: med,
      icon: AlertTriangle,
      title: "Expired",
      message: `${med.name} expired on ${new Date(med.expiryDate).toLocaleDateString()}`,
      severity: "critical",
    })),
    ...outOfStockMedicines.map((med) => ({
      type: "outOfStock",
      medicine: med,
      icon: Zap,
      title: "Out of Stock",
      message: `${med.name} is out of stock`,
      severity: "critical",
    })),
    ...expiringSoonMedicines.map((med) => {
      const days = Math.ceil((new Date(med.expiryDate) - now) / (1000 * 60 * 60 * 24));
      return {
        type: "expiringSoon",
        medicine: med,
        icon: Clock,
        title: "Expiring Soon",
        message: `${med.name} expires in ${days} days`,
        severity: "warning",
      };
    }),
    ...lowStockMedicines.map((med) => ({
      type: "lowStock",
      medicine: med,
      icon: AlertTriangle,
      title: "Low Stock",
      message: `${med.name} has only ${med.stock} left`,
      severity: "warning",
    })),
  ];

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-3">
            <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Alerts & Notifications</h1>
        <p className="text-gray-600 font-medium mt-2">Stay on top of your medicine health</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-gray-300 transition-all">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">
            {allAlerts.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Total Alerts</p>
        </div>
        
        <div className="bg-red-50 rounded-2xl p-4 sm:p-5 border border-red-200">
          <div className="text-2xl sm:text-3xl font-bold text-red-600">
            {expiredMedicines.length + outOfStockMedicines.length}
          </div>
          <p className="text-xs sm:text-sm text-red-700 font-medium mt-1">Critical</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200">
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">
            {expiringSoonMedicines.length + lowStockMedicines.length}
          </div>
          <p className="text-xs sm:text-sm text-amber-700 font-medium mt-1">Warning</p>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 sm:p-5 border border-green-200">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {Math.max(0, medicines.length - allAlerts.length)}
          </div>
          <p className="text-xs sm:text-sm text-green-700 font-medium mt-1">Healthy</p>
        </div>
      </div>

      {/* Alerts List */}
      {allAlerts.length > 0 ? (
        <div className="space-y-3">
          {/* Critical Alerts */}
          {allAlerts.filter((a) => a.severity === "critical").length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 letter-spacing-1">
                🔴 Critical Alerts
              </p>
              <div className="space-y-2">
                {allAlerts
                  .filter((a) => a.severity === "critical")
                  .map((alert, idx) => {
                    const Icon = alert.icon;
                    return (
                      <div
                        key={idx}
                        className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="p-2.5 rounded-xl bg-red-100 flex-shrink-0">
                          <Icon className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-red-900">{alert.title}</h3>
                          <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Warning Alerts */}
          {allAlerts.filter((a) => a.severity === "warning").length > 0 && (
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 letter-spacing-1">
                ⚠️ Warnings
              </p>
              <div className="space-y-2">
                {allAlerts
                  .filter((a) => a.severity === "warning")
                  .map((alert, idx) => {
                    const Icon = alert.icon;
                    return (
                      <div
                        key={idx}
                        className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-300 hover:shadow-sm transition-all duration-300"
                      >
                        <div className="p-2.5 rounded-xl bg-amber-100 flex-shrink-0">
                          <Icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-amber-900">{alert.title}</h3>
                          <p className="text-sm text-amber-700 mt-1">{alert.message}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="p-4 rounded-2xl bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Clear! 🎉</h2>
          <p className="text-gray-600 text-center font-medium">
            No active alerts. Your medicines are all in good standing.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Keep monitoring for upcoming expiry dates and stock levels.
          </p>
        </div>
      )}

      {/* Action Card */}
      {allAlerts.length > 0 && (
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-6 sm:p-8 border border-teal-100">
          <h3 className="font-semibold text-gray-900 mb-2">Recommended Actions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {expiredMedicines.length > 0 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Dispose of {expiredMedicines.length} expired medicine(s)
              </li>
            )}
            {outOfStockMedicines.length > 0 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Reorder {outOfStockMedicines.length} out-of-stock medicine(s)
              </li>
            )}
            {lowStockMedicines.length > 0 && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Consider reordering {lowStockMedicines.length} low-stock medicine(s)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AlertsSection;
