
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
      const days = Math.ceil(
        (expiry - now) / (1000 * 60 * 60 * 24)
      );

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
    <div
      className="relative w-full space-y-6 overflow-hidden rounded-3xl
        border border-white/[0.09] bg-white/[0.035]
        p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        backdrop-blur-2xl transition-all duration-300
        hover:border-[#00C2C7]/25 sm:p-7"
    >
      {/* Ambient teal glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#00C2C7]/[0.06] blur-3xl" />

      {/* Header */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#00C2C7]/20 bg-[#00C2C7]/[0.09] p-2.5">
            <Clock className="h-5 w-5 text-[#00C2C7]" />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-100 sm:text-xl">
              Expiry Timeline
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Upcoming medicine expiries
            </p>
          </div>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-[#00C2C7]/30 via-white/[0.08] to-transparent" />
      </div>

      {/* Expiry groups */}
      <div className="relative space-y-5">
        <TimelineSection
          title="Today"
          items={grouped.today}
          tone="danger"
          icon={<AlertCircle className="h-4 w-4" />}
        />

        <TimelineSection
          title="1–3 days"
          items={grouped.soon}
          tone="urgent"
          icon={<AlertCircle className="h-4 w-4" />}
        />

        <TimelineSection
          title="This week"
          items={grouped.week}
          tone="warning"
          icon={<Clock className="h-4 w-4" />}
        />

        <TimelineSection
          title="This month"
          items={grouped.month}
          tone="safe"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* Empty state */}
      {Object.values(grouped).every((items) => items.length === 0) && (
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-7 text-center">
          <Clock className="mx-auto mb-3 h-8 w-8 text-gray-500" />
          <p className="text-sm font-medium text-gray-200">
            No upcoming expiries
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Medicines expiring within the next 30 days will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExpiryTimelineCard;
