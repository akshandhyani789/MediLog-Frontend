import { completeOnboarding } from "../services/api";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { setIsOnboarded, setUserData } = useAuth(); // ✅ IMPORTANT


  const completeOnboardingAndGoToDashboard = async (data) => {
    try {
      const user = auth.currentUser;

      const res = await completeOnboarding(user, data);

      console.log("Onboarding response:", res);

      // ✅ UPDATE STATE INSTANTLY
      setIsOnboarded(true);
      setUserData(res.user); // ✅ UPDATE FULL USER DATA
      setTimeout(() => {
      navigate("/dashboard");
      }, 500); // ✅ small delay for better UX
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  return { completeOnboardingAndGoToDashboard };
};