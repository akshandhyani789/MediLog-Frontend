import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MedilogLoader from "../components/MedilogLoader";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isOnboarded } = useAuth();
  const location = useLocation();

  if (loading || isOnboarded === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <MedilogLoader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;