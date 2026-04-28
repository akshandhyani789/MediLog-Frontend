import React, { useMemo } from "react";
import TimelineSection from "./TimelineSection";
import { AlertCircle, Clock, Activity } from "lucide-react";

function ExpiryTimelineCard({ medicines = [] }) {

  const grouped = useMemo(() => {
    const today = [];
    const soon = [];
    const week = [];
    const month = [];

    const now = new Date();

    medicines.forEach((med) => {
      if (!med.expiryDate) return;

      const expiry = new Date(med.expiryDate);
      const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

      const item = {
        name: med.name,
        subtitle: med.dosage,
        days,
      };

      if (days <= 0) today.push(item);
      else if (days <= 3) soon.push(item);
      else if (days <= 7) week.push(item);
      else if (days <= 30) month.push(item);
    });

    return { today, soon, week, month };

  }, [medicines]);

  return (
    <div className="rounded-2xl p-5 bg-white border shadow-sm space-y-6">

      <div>
        <h2 className="text-lg font-semibold">Expiry Timeline</h2>
        <p className="text-sm text-gray-500">Upcoming expiries</p>
      </div>

      <TimelineSection title="Today" items={grouped.today} tone="danger" icon={<AlertCircle />} />
      <TimelineSection title="1–3 days" items={grouped.soon} tone="urgent" icon={<AlertCircle />} />
      <TimelineSection title="This week" items={grouped.week} tone="warning" icon={<Clock />} />
      <TimelineSection title="This month" items={grouped.month} tone="safe" icon={<Activity />} />

    </div>
  );
}

export default ExpiryTimelineCard;