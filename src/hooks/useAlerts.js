import { useEffect, useMemo, useState } from "react";

export function useAlerts(alertsData) {
  const {
    medicines = [],
    allAlerts = [],
    loading = false,
  } = alertsData || {};

  const [checkedAlerts, setCheckedAlerts] = useState([]);

  useEffect(() => {
    const savedAlerts = sessionStorage.getItem("checkedAlerts");
    if (savedAlerts) {
      setCheckedAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const getAlertId = (alert, idx) => {
    return alert.id || alert._id || `${alert.title}-${alert.message}-${idx}`;
  };

  const alertsWithIds = useMemo(() => {
    return allAlerts.map((alert, idx) => ({
      ...alert,
      id: getAlertId(alert, idx),
      severity:
        alert.severity ||
        alert.type ||
        alert.status ||
        "warning",
    }));
  }, [allAlerts]);

  const visibleAlerts = useMemo(() => {
    return alertsWithIds.filter(
      (alert) => !checkedAlerts.includes(alert.id)
    );
  }, [alertsWithIds, checkedAlerts]);

  const criticalAlerts = visibleAlerts.filter(
    (alert) =>
      alert.severity === "critical" ||
      alert.severity === "expired"
  );

  const warningAlerts = visibleAlerts.filter(
    (alert) =>
      alert.severity === "warning" ||
      alert.severity === "expiring"
  );

  const handleCheckAlert = (alertId) => {
    const updatedCheckedAlerts = [...checkedAlerts, alertId];

    setCheckedAlerts(updatedCheckedAlerts);
    sessionStorage.setItem(
      "checkedAlerts",
      JSON.stringify(updatedCheckedAlerts)
    );
  };

  const alertCounts = {
    active: visibleAlerts.length,
    critical: criticalAlerts.length,
    warning: warningAlerts.length,
    healthy: Math.max(0, medicines.length - allAlerts.length),
  };

  return {
    loading,
    visibleAlerts,
    criticalAlerts,
    warningAlerts,
    alertCounts,
    handleCheckAlert,
  };
}