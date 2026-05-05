import { useState, useEffect } from "react";
import { getUserMedicines } from "../services/api";
import { AlertTriangle, Clock, Zap } from "lucide-react";

export function useAlertsData(user) {
  const [data, setData] = useState({
    medicines: [],
    expired: [],
    expiringSoon: [],
    lowStock: [],
    outOfStock: [],
    allAlerts: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const medicines = await getUserMedicines(user);
        const now = new Date();

        const expired = medicines.filter(
          (m) => m.expiryDate && new Date(m.expiryDate) < now
        );

        const expiringSoon = medicines.filter((m) => {
          if (!m.expiryDate) return false;
          const diff = (new Date(m.expiryDate) - now) / (1000 * 60 * 60 * 24);
          return diff > 0 && diff <= 30;
        });

        const lowStock = medicines.filter((m) => m.stock > 0 && m.stock < 5);
        const outOfStock = medicines.filter((m) => m.stock === 0);

        const allAlerts = [
          ...expired.map((m) => ({
            type: "expired",
            medicine: m,
            title: "Expired",
            message: `${m.name} expired on ${new Date(m.expiryDate).toLocaleDateString()}`,
            severity: "critical",
            icon: AlertTriangle,
          })),

          ...outOfStock.map((m) => ({
            type: "outOfStock",
            medicine: m,
            title: "Out of Stock",
            message: `${m.name} is out of stock`,
            severity: "critical",
            icon: Zap,
          })),

          ...expiringSoon.map((m) => {
            const days = Math.ceil(
              (new Date(m.expiryDate) - now) / (1000 * 60 * 60 * 24)
            );
            return {
              type: "expiringSoon",
              medicine: m,
              title: "Expiring Soon",
              message: `${m.name} expires in ${days} days`,
              severity: "warning",
              icon: Clock,
            };
          }),

          ...lowStock.map((m) => ({
            type: "lowStock",
            medicine: m,
            title: "Low Stock",
            message: `${m.name} has only ${m.stock} left`,
            severity: "warning",
            icon: AlertTriangle,
          })),
        ];

        setData({
          medicines,
          expired,
          expiringSoon,
          lowStock,
          outOfStock,
          allAlerts,
          loading: false,
        });
      } catch (err) {
        console.error("Alerts hook error:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  return data;
}