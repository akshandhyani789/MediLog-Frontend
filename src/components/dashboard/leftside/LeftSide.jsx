import React, { useEffect } from "react";
import {
  Bell,
  LayoutDashboard,
  Pill,
  User,
  Package,
} from "lucide-react";

import Logo from "../../Logo";
import { useAuth } from "../../../hooks/useAuth";

function LeftSide({
  setActivePage,
  activeNav,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const { userData, user } = useAuth();
  const userRole = userData?.role || "individual";

  const individualMenu = [
    { name: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { name: "MyMedicines", label: "Medicines", icon: Pill },
    { name: "Alerts", label: "Alerts", icon: Bell },
    { name: "Profile", label: "Profile", icon: User },
  ];

  const vendorMenu = [
    { name: "Dashboard", label: "Vendor Dashboard", icon: LayoutDashboard },
    { name: "MyMedicines", label: "Medicines", icon: Pill },
    { name: "Stock", label: "Stock", icon: Package },
    { name: "Alerts", label: "Alerts", icon: Bell },
    { name: "Profile", label: "Profile", icon: User },
  ];

  const menuItems = userRole === "vendor" ? vendorMenu : individualMenu;

  const handleClick = (page) => {
    setActivePage(page);

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          
          border-r border-white/60
          flex flex-col justify-between p-4 shadow-xl z-50
          transform transition-transform duration-300
          bg-white backdrop-blur-md
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Background blur */}
        

        <div className="relative z-10">
          <div className="p-2 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 shadow-sm">
            <Logo />
          </div>

          <ul className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;

              return (
                <li
                  key={item.name}
                  onClick={() => handleClick(item.name)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#0F766E] text-white shadow-md"
                      : "text-gray-700 hover:bg-white/70 hover:text-[#0F766E]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "group-hover:text-[#0F766E]"
                    }`}
                  />
                  <span className="text-sm font-semibold">{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative z-10 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 shadow-sm p-4 text-xs text-gray-500 text-center">
          Logged in as <br />

          <span className="block mt-1 font-semibold text-gray-700 truncate">
            {user?.email || "Unknown"}
          </span>

          <p className="inline-block mt-3 px-3 py-1 rounded-full capitalize bg-teal-50 text-[#0F766E] font-bold border border-teal-100">
            {userRole}
          </p>
        </div>
      </aside>
    </>
  );
}

export default LeftSide;