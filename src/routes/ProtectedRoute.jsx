import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MedilogLoader from "../components/MedilogLoader";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isOnboarded } = useAuth();
  const location = useLocation();

  // ✅ Wait for Firebase + backend
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
  <MedilogLoader />
</div>;
  }

  // ❌ Not logged in → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ⚠️ Wait until onboarding status is known
  if (isOnboarded === null) {
    return <div className="flex h-screen w-full items-center justify-center">
  <MedilogLoader />
</div>;
  }

  // 🔥 Not onboarded → force onboarding
  if (!isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // 🔥 Already onboarded → block onboarding page
  if (isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;