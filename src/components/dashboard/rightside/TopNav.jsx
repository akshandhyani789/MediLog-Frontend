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

  const {
    alertCounts,
  } = useAlerts(alertsData);

  const profileImage = userData?.profileImage || user?.photoURL || "";
  const UserName = userData?.name || "User";

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (page) => {
    setActivePage(page);
  };

  const Hours = time.getHours().toString().padStart(2, "0");
  const Minutes = time.getMinutes().toString().padStart(2, "0");
  const Seconds = time.getSeconds().toString().padStart(2, "0");

  const Day = time.toLocaleString("default", { weekday: "short" });
  const date = time.getDate();
  const Month = time.toLocaleString("default", { month: "short" });

  return (
    <nav className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-8 border-b border-white/40 backdrop-blur-xl bg-gradient-to-r from-slate-50/95 via-teal-50/90 to-slate-100/95 shadow-sm ">
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-300 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-300 blur-[140px] rounded-full" />
      </div>
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        
        {/* MOBILE MENU */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* PAGE BADGE */}
        <div className="px-4 py-1.5 rounded-xl bg-white/70 backdrop-blur-md text-teal-700 font-semibold text-sm hidden sm:block border border-white shadow-sm">
          {activePage}
        </div>

        {/* CLOCK */}
        <div className="hidden sm:flex gap-1 text-sm text-gray-700 font-semibold">
          {Hours}:{Minutes}
          <span className="text-gray-400">:{Seconds}</span>
        </div>

        {/* DATE */}
        <div className="hidden lg:block text-sm text-gray-500 font-medium">
          {Day}, {date} {Month}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        
        {/* ALERT BUTTON */}
        <button
          onClick={() => handleClick("Alerts")}
          className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 hover:bg-white/80 border border-white shadow-sm transition-all duration-200"
        >
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-700" />

            {alertCounts.active > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                {alertCounts.active > 9 ? "9+" : alertCounts.active}
              </span>
            )}
          </div>

          <span className="hidden sm:inline text-gray-700 font-medium">
            Alerts
          </span>
        </button>

        {/* PROFILE BUTTON */}
        <button
          onClick={() => handleClick("Profile")}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-white shadow-sm transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {UserName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[110px] truncate">
            {UserName}
          </span>

          <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
        </button>
      </div>
    </nav>
  );
}

export default TopNav;