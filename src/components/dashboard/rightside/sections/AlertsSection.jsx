import React from "react";
import NoAlertsCard from "../componant/alertComponants/NoAlertsCard";
import AlertCard from "../componant/alertComponants/AlertCard";
import { useAlerts } from "../../../../hooks/useAlerts";

function AlertsSection({ alertsData }) {
  const {
    loading,
    visibleAlerts,
    criticalAlerts,
    warningAlerts,
    alertCounts,
    handleCheckAlert,
  } = useAlerts(alertsData);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Alerts & Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          Stay on top of your medicine health
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold">{alertCounts.active}</h2>
          <p className="text-sm text-gray-500">Active Alerts</p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <h2 className="text-2xl font-bold text-red-600">
            {alertCounts.critical}
          </h2>
          <p className="text-sm text-red-700">Critical</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <h2 className="text-2xl font-bold text-yellow-600">
            {alertCounts.warning}
          </h2>
          <p className="text-sm text-yellow-700">Warning</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h2 className="text-2xl font-bold text-green-600">
            {alertCounts.healthy}
          </h2>
          <p className="text-sm text-green-700">Healthy</p>
        </div>
      </div>

      {visibleAlerts.length > 0 ? (
        <div className="space-y-6">
          {criticalAlerts.length > 0 && (
            <div>
              <p className="text-red-600 font-bold mb-2">
                🔴 Critical Alerts
              </p>

              {criticalAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onCheck={handleCheckAlert}
                />
              ))}
            </div>
          )}

          {warningAlerts.length > 0 && (
            <div>
              <p className="text-yellow-600 font-bold mb-2">
                ⚠️ Warnings
              </p>

              {warningAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onCheck={handleCheckAlert}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <NoAlertsCard />
      )}
    </div>
  );
}

export default AlertsSection;