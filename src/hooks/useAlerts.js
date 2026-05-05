import { useEffect, useMemo, useState } from "react";

export function useAlerts(alertsData) {
  const {
    medicines = [],
    allAlerts = [],
    loading = false,
  } = alertsData || {};

  const [checkedAlerts, setCheckedAlerts] = useState([]);

  const getAlertId = (alert, idx) => {
    return alert.id || alert._id || `${alert.title}-${alert.message}-${idx}`;
  };

  useEffect(() => {
    const savedAlerts = sessionStorage.getItem("checkedAlerts");

    if (savedAlerts) {
      setCheckedAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const alertsWithIds = useMemo(() => {
    return allAlerts.map((alert, idx) => ({
      ...alert,
      id: getAlertId(alert, idx),
    }));
  }, [allAlerts]);

  const visibleAlerts = useMemo(() => {
    return alertsWithIds.filter(
      (alert) => !checkedAlerts.includes(alert.id)
    );
  }, [alertsWithIds, checkedAlerts]);

  const criticalAlerts = visibleAlerts.filter(
    (alert) => alert.severity === "critical"
  );

  const warningAlerts = visibleAlerts.filter(
    (alert) => alert.severity === "warning"
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