import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useAlerts } from "../../../hooks/useAlerts";
import { useAlertsData } from "../../../hooks/useAlertData";

function TopNav({ activePage, setIsSidebarOpen, setActivePage }) {
  const { user, userData } = useAuth();
  const alertsData = useAlertsData(user);

  const { alertCounts } = useAlerts(alertsData);

  const profileImage = userData?.profileImage || user?.photoURL || "";
  const userName =
    userData?.name ||
    userData?.fullName ||
    user?.displayName ||
    "User";

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = (page) => {
    setActivePage(page);
  };

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const day = time.toLocaleString("default", { weekday: "short" });
  const date = time.getDate();
  const month = time.toLocaleString("default", { month: "short" });

  return (
    <nav className="dashboard-nav sticky top-0 z-40 h-16 w-full shrink-0 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-7 lg:px-8">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-[20%] h-40 w-64 rounded-full bg-teal-500/[0.04] blur-[90px]" />
      </div>

      <div className="relative flex h-full items-center justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-teal-50 hover:text-[#0F857B] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb and page title */}
          <div className="min-w-0">
            <div className="mb-0.5 hidden items-center gap-2 text-[11px] font-medium text-gray-500 sm:flex">
              <span>Dashboard</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600">{activePage || "Overview"}</span>
            </div>

            <h1 className="truncate text-base font-semibold tracking-tight text-[#172B3A] sm:text-lg">
              {activePage || "Dashboard"}
            </h1>
          </div>

          {/* Clock and date */}
          <div className="ml-1 hidden items-center gap-3 border-l border-slate-200 pl-4 xl:flex">
            <span className="font-mono text-xs font-medium text-slate-700">
              {hours}:{minutes}
              <span className="text-slate-500">:{seconds}</span>
            </span>

            <span className="text-xs text-slate-500">
              {day}, {date} {month}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search bar - visual UI */}
          
          {/* Alerts button */}
          <button
            type="button"
            onClick={() => handleClick("Alerts")}
            aria-label={`Open alerts. ${alertCounts?.active || 0} active alerts`}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
          >
            <Bell className="h-5 w-5" />

            {alertCounts?.active > 0 && (
              <>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white" />
                <span className="sr-only">
                  {alertCounts.active} active alerts
                </span>
              </>
            )}
          </button>

          {/* Add Medicine button */}
         

          {/* Profile button */}
          <button
            type="button"
            onClick={() => handleClick("Profile")}
            aria-label="Open profile"
            className="group flex h-11 shrink-0 items-center gap-2 rounded-xl px-1.5 transition-colors hover:bg-white/[0.05] sm:pl-1.5 sm:pr-0"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-teal-400/30 bg-teal-500/[0.12]">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold tracking-wide text-teal-200">
                  {userName
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <ChevronDown className="hidden h-4 w-4 text-slate-500 transition-colors group-hover:text-[#0F857B] sm:block" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;