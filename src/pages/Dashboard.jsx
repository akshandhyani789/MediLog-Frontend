import { useState, useEffect } from "react";
import TopNav from "../components/dashboard/rightside/TopNav";
import LeftSide from "../components/dashboard/leftside/LeftSide";
import SectionsDataRight from "../components/dashboard/rightside/SectionsDataRight";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { userData } = useAuth();
  const userRole = userData?.role || "individual";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 return (
  <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-50">
    <LeftSide
      setActivePage={setActivePage}
      activeNav={activePage}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />

    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    <main className="flex-1 min-w-0 w-full flex flex-col transition-all duration-300 ml-0 lg:ml-56 xl:ml-64 overflow-x-hidden">
      <TopNav
        activePage={activePage}
        setIsSidebarOpen={setIsSidebarOpen}
        setActivePage={setActivePage}
      />

      <div className="w-full max-w-full overflow-x-hidden px-2 py-3 sm:p-6 md:p-8">
        <SectionsDataRight
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </div>
    </main>
  </div>
);
}

export default Dashboard;