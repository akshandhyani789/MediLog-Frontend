import React, { useState, useEffect } from "react";
import { Bell, Moon, UserCircle, ChevronDown, Menu } from "lucide-react";
import InfoBadge from "./componant/InfoBadge";
import { useAuth } from "../../../context/AuthContext";
import { getUserMedicines } from "../../../services/api"; // 🔥 fix path

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

  const expiryCount = medicines.filter((med) => {
    const expiry = new Date(med.expiryDate);
    return expiry < now;
  }).length;

  // 🕒 Time format
  const Hours = time.getHours().toString().padStart(2, "0");
  const Minutes = time.getMinutes().toString().padStart(2, "0");
  const Seconds = time.getSeconds().toString().padStart(2, "0");

  const Day = time.toLocaleString("default", { weekday: "short" });
  const date = time.getDate();
  const Month = time.toLocaleString("default", { month: "short" });

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b h-16 flex items-center justify-between px-3 sm:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* Menu */}
        <button
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-teal-100"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Page */}
        <div className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-700 font-semibold">
          {activePage}
        </div>

        {/* Time */}
        <div className="hidden sm:flex gap-1 text-sm text-gray-700">
          {Hours}:{Minutes}:<span className="text-gray-400">{Seconds}</span>
        </div>

        {/* Date */}
        <div className="hidden lg:block text-sm text-gray-500">
          {Day}, {date} {Month}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Alerts */}
        <InfoBadge
          Icon={Bell}
          iconText="Alerts"
          countType="alerts"
          color="text-teal-700"
          bgColor="bg-teal-50"
          alertCount={alertCount}
          handleClick={() => handleClick("Alerts")}
        />

        {/* Dark mode */}
        <div className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 cursor-pointer">
          <Moon className="w-4 h-4 text-teal-700" />
        </div>

        {/* User */}
        <div
        onClick={() => handleClick("Profile")} 
         className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
          <UserCircle className="w-5 h-5 text-teal-700" />
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {UserName}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

      </div>
    </nav>
  );
}

export default TopNav;