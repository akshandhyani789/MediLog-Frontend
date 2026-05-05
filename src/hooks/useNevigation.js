import { completeOnboarding } from "../services/api";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { setIsOnboarded, setUserData } = useAuth();

  const completeOnboardingAndGoToDashboard = async (data) => {
    try {
      const user = auth.currentUser;
      const res = await completeOnboarding(user, data);

      setIsOnboarded(true);
      setUserData(res.user);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  return { completeOnboardingAndGoToDashboard };
};