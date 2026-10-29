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
    { name: "FindMedicine", label: "Find Medicine", icon: Package },
    { name: "MyMedicineBundles", label: "My Medicine Bundles", icon: Package },
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
    <aside
      className={`
        fixed top-0 left-0 z-50
        flex h-screen w-64 flex-col justify-between
        dashboard-sidebar
        border-r border-slate-200
        bg-gradient-to-b from-white to-[#ECFDF5] p-4
        shadow-xl shadow-slate-900/5
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* Logo container */}
        <div className="rounded-xl border border-teal-100 bg-white/80 p-2 transition-colors duration-200">
          <Logo variant="dark" />
        </div>

        {/* Existing navigation items */}
        <ul className="mt-7 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;

            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => handleClick(item.name)}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    group relative flex w-full items-center gap-3
                    overflow-hidden rounded-xl
                    border-l-2 px-3 py-3
                    text-left text-sm font-medium
                    transition-all duration-200 ease-out
                    ${
                      isActive
                        ? "border-l-teal-700 bg-gradient-to-r from-teal-700 to-teal-500 text-white shadow-md shadow-teal-900/10"
                        : "border-l-transparent text-slate-600 hover:border-l-teal-500 hover:bg-teal-50 hover:text-teal-800"
                    }
                  `}
                >
                  {/* Icon */}
                  <Icon
                    className={`
                      h-[19px] w-[19px] shrink-0
                      transition-all duration-200
                      ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-teal-700"
                      }
                    `}
                    strokeWidth={isActive ? 2 : 1.8}
                  />

                  {/* Label */}
                  <span className="flex-1 truncate">
                    {item.label}
                  </span>

                  {/* Subtle active indicator */}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00C2C7] shadow-[0_0_8px_rgba(0,194,199,0.55)]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-slate-200 pt-4">
        <div className="rounded-xl border border-transparent px-2 py-3 transition-colors duration-200 hover:border-teal-100 hover:bg-white/70">
          

          <div className="truncate text-sm font-semibold text-slate-900">
            {userData?.name || user?.displayName || "User"}
          </div>

          <div className="mt-1 truncate text-xs text-slate-500">
            {user?.email || "Unknown"}
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal-800">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSide;
