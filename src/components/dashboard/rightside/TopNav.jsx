import React, { useState, useEffect } from "react";
import { Bell, Moon, UserCircle, ChevronDown, Menu } from "lucide-react";
import InfoBadge from "./componant/InfoBadge";
import { useAuth } from "../../../context/AuthContext";
import { getUserMedicines } from "../../../services/api";

function TopNav({ activePage, setIsSidebarOpen, setActivePage }) {
  const { user, userData } = useAuth();
  const handleClick = (page) => {
    setActivePage(page);
  };

  const UserName = userData?.name || "User";

  const [time, setTime] = useState(new Date());
  const [medicines, setMedicines] = useState([]);

  // ⏱️ Time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 📦 Fetch medicines
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getUserMedicines(user);
      setMedicines(data || []);
    };

    fetchData();
  }, [user]);

  // 🧠 Calculate alerts
  const now = new Date();

  const alertCount = medicines.filter((med) => {
    const expiry = new Date(med.expiryDate);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);

    return diffDays <= 30 || med.stock <= 5;
  }).length;

  // 🕒 Time format
  const Hours = time.getHours().toString().padStart(2, "0");
  const Minutes = time.getMinutes().toString().padStart(2, "0");
  const Seconds = time.getSeconds().toString().padStart(2, "0");

  const Day = time.toLocaleString("default", { weekday: "short" });
  const date = time.getDate();
  const Month = time.toLocaleString("default", { month: "short" });

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-sm bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Page Badge */}
        <div className="px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 text-teal-700 font-semibold text-sm hidden sm:block border border-teal-100">
          {activePage}
        </div>

        {/* Time */}
        <div className="hidden sm:flex gap-1 text-xs text-gray-600 font-medium tracking-tight">
          {Hours}:{Minutes}<span className="text-gray-400">:{Seconds}</span>
        </div>

        {/* Date */}
        <div className="hidden lg:block text-xs text-gray-500 font-medium">
          {Day}, {date} {Month}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Alert Badge with Icon */}
        <button
          onClick={() => handleClick("Alerts")}
          className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 group"
        >
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-700" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-gray-700">{alertCount > 0 ? `${alertCount} Alert${alertCount !== 1 ? 's' : ''}` : 'Alerts'}</span>
        </button>

        {/* Theme Toggle */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Moon className="w-5 h-5 text-gray-600" />
        </button>

        {/* User Menu */}
        <button
          onClick={() => handleClick("Profile")}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
            {UserName}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
        </button>

      </div>
    </nav>
  );
}

export default TopNav;