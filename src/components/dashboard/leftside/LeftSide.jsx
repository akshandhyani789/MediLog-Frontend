import React, { useEffect } from "react";
import { Bell, LayoutDashboard, Pill, User } from "lucide-react";
import Logo from "../../Logo";
import { useAuth } from "../../../hooks/useAuth";

function LeftSide({
  setActivePage,
  activeNav,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const { user } = useAuth();

  const handleClick = (page) => {
    setActivePage(page);

    // close sidebar only on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // ✅ FIXED: responsive behavior (no forced open on desktop)
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
      {/* 🔥 MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <aside
  className={`
    fixed top-0 left-0 h-screen w-64 bg-white
    flex flex-col justify-between p-4 shadow-xl z-50

    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    
    lg:translate-x-0
  `}
>
        {/* TOP */}
        <div>
          <div className="p-2">
            <Logo />
          </div>

          <ul className="mt-6 space-y-2">
            {/* Dashboard */}
            <li
              onClick={() => handleClick("Dashboard")}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
              ${
                activeNav === "Dashboard"
                  ? "bg-[#0F766E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeNav === "Dashboard"
                    ? "text-white"
                    : "group-hover:text-[#0F766E]"
                }`}
              />
              <span className="text-sm font-medium">Dashboard</span>
            </li>

            {/* My Medicines */}
            <li
              onClick={() => handleClick("MyMedicines")}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
              ${
                activeNav === "MyMedicines"
                  ? "bg-[#0F766E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"
              }`}
            >
              <Pill
                className={`w-4 h-4 ${
                  activeNav === "MyMedicines"
                    ? "text-white"
                    : "group-hover:text-[#0F766E]"
                }`}
              />
              <span className="text-sm font-medium">My Medicines</span>
            </li>

            {/* Alerts */}
            <li
              onClick={() => handleClick("Alerts")}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
              ${
                activeNav === "Alerts"
                  ? "bg-[#0F766E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"
              }`}
            >
              <Bell
                className={`w-4 h-4 ${
                  activeNav === "Alerts"
                    ? "text-white"
                    : "group-hover:text-[#0F766E]"
                }`}
              />
              <span className="text-sm font-medium">Alerts</span>
            </li>

            {/* Profile */}
            <li
              onClick={() => handleClick("Profile")}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
              ${
                activeNav === "Profile"
                  ? "bg-[#0F766E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#0F766E]/10 hover:text-[#0F766E]"
              }`}
            >
              <User
                className={`w-4 h-4 ${
                  activeNav === "Profile"
                    ? "text-white"
                    : "group-hover:text-[#0F766E]"
                }`}
              />
              <span className="text-sm font-medium">Profile</span>
            </li>
          </ul>
        </div>

        {/* BOTTOM */}
        <div className="text-xs text-gray-400 text-center">
          Logged in as <br />
          <span className="font-medium text-gray-600">
            {user?.email || "Unknown"}
          </span>
        </div>
      </aside>
    </>
  );
}

export default LeftSide;