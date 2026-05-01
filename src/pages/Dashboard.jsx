import { useState, useEffect } from "react";
import TopNav from "../components/dashboard/rightside/TopNav";
import LeftSide from "../components/dashboard/leftside/LeftSide";
import SectionsDataRight from "../components/dashboard/rightside/SectionsDataRight";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { userData } = useAuth();
  const [userRole, setUserRole] = useState(null);

  // ✅ Set role
  useEffect(() => {
    if (userData?.role) {
      setUserRole(userData.role);
      console.log("User role set to:", userData.role);
    }
  }, [userData]);

  // ✅ FIX: Auto close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // reset mobile state
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔥 Sidebar */}
      <LeftSide
        setActivePage={setActivePage}
        activeNav={activePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* 🔥 Overlay (Mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🔥 Main Content */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ml-0
          lg:ml-56 xl:ml-64
        `}
      >
        {/* 🔥 Top Nav */}
        <TopNav
          activePage={activePage}
          setIsSidebarOpen={setIsSidebarOpen}
          setActivePage={setActivePage}
        />

        {/* 🔥 Page Content */}
        <div className="p-4 sm:p-6 md:p-8">
          <SectionsDataRight
            activePage={activePage}
            setActivePage={setActivePage}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;