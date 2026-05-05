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
  const { userData } = useAuth();
  const userRole = userData?.role || "individual";
  const { user } = useAuth();
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
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white
          flex flex-col justify-between p-4 shadow-xl z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div>
          <div className="p-2">
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
                  className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition ${
                    isActive
                      ? "bg-[#0F766E] text-white shadow-sm"
                      : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "group-hover:text-[#0F766E]"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Logged in as <br />
          <span className="font-medium text-gray-600">
            {user?.email || "Unknown"}
          </span>

          <p className="mt-2 capitalize text-[#0F766E] font-medium">
            {userRole}
          </p>
        </div>
      </aside>
    </>
  );
}

export default LeftSide;