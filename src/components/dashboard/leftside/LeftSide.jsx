import React from "react";
import { Bell, LayoutDashboard, Pill, User } from "lucide-react";
import Logo from "../../Logo";
import { useAuth } from "../../../hooks/useAuth";

function LeftSide({ setActivePage, activeNav, isSidebarOpen, setIsSidebarOpen }) {

  const iconStyle = "w-5 h-5 2xl:w-6 2xl:h-6";
  const itemStyle = "text-sm 2xl:text-lg 4xl:text-2xl";

  const navItemBase =
    "flex items-center gap-3 font-medium cursor-pointer px-5 py-2 rounded-lg transition";

  const activeStyle = "bg-[#06B6D4]/20 text-[#0d9488]";
  const hoverStyle = "hover:bg-[#06B6D4]/10";

  const handleClick = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // close on mobile
  };

  const { user } = useAuth();
  const email = user?.email || "Unknown User";
  console.log("Authenticated user email:", user);

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white w-56 xl:w-64 
        flex flex-col justify-between p-3 shadow-lg z-50
        transform transition-transform duration-300

        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      
      <div>
        <div className="p-2">
          <Logo />
        </div>

        <ul className="mt-6 space-y-2">

  {/* Dashboard */}
  <li
    onClick={() => handleClick("Dashboard")}
    className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
    ${activeNav === "Dashboard"
        ? "bg-[#0F766E] text-white shadow-sm"
        : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"}
    `}
  >
    <LayoutDashboard className={`w-4 h-4 transition 
      ${activeNav === "Dashboard" ? "text-white" : "group-hover:text-[#0F766E]"}`} />
    <span className="text-sm font-medium">Dashboard</span>
  </li>

  {/* My Medicines */}
  <li
    onClick={() => handleClick("MyMedicines")}
    className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
    ${activeNav === "MyMedicines"
        ? "bg-[#0F766E] text-white shadow-sm"
        : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"}
    `}
  >
    <Pill className={`w-4 h-4 transition 
      ${activeNav === "MyMedicines" ? "text-white" : "group-hover:text-[#0F766E]"}`} />
    <span className="text-sm font-medium">My Medicines</span>
  </li>

  {/* Alerts */}
  <li
    onClick={() => handleClick("Alerts")}
    className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
    ${activeNav === "Alerts"
        ? "bg-[#0F766E] text-white shadow-sm"
        : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"}
    `}
  >
    <Bell className={`w-4 h-4 transition 
      ${activeNav === "Alerts" ? "text-white" : "group-hover:text-[#0F766E]"}`} />
    <span className="text-sm font-medium">Alerts</span>
  </li>

  {/* Profile */}
  <li
    onClick={() => handleClick("Profile")}
    className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
    ${activeNav === "Profile"
        ? "bg-[#0F766E] text-white shadow-sm"
        : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"}
    `}
  >
    <User className={`w-4 h-4 transition 
      ${activeNav === "Profile" ? "text-white" : "group-hover:text-[#0F766E]"}`} />
    <span className="text-sm font-medium">Profile</span>
  </li>

</ul>
      </div>

      <div className="flex justify-center pb-2">
        <input type="checkbox" className="cursor-pointer" />
      </div>

    </div>
  );
}

export default LeftSide;