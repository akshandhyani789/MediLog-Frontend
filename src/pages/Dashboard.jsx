import { useState, useEffect } from "react";
import TopNav from "../components/dashboard/rightside/TopNav";
import LeftSide from "../components/dashboard/leftside/LeftSide";
import SectionsDataRight from "../components/dashboard/rightside/SectionsDataRight";
import { useAuth } from "../context/AuthContext";
import { getMedicineByBarcode } from "../services/api";


function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { userData } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => { 
    if (userData?.role) {
      setUserRole(userData.role);
      console.log("User role set to:", userData.role);
    }
  }, [userData]);


  return (
    <div className="flex">

      {/* Sidebar */}
      <LeftSide
        setActivePage={setActivePage}
        activeNav={activePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Overlay (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Right Section */}
      <div
  className={`
    flex-1 transition-all duration-300
    ${isSidebarOpen ? "ml-56 xl:ml-64" : "ml-0"}
  `}
>
        
        <TopNav
          activePage={activePage}
          setIsSidebarOpen={setIsSidebarOpen}
          setActivePage={setActivePage}
        />

        <SectionsDataRight activePage={activePage} setActivePage={setActivePage}/>
      </div>
    </div>
  );
}

export default Dashboard;